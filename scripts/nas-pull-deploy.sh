#!/usr/bin/env bash
#
# Pull-based deploy, run on the NAS itself.
#
# This is the only deploy path. It replaced a GitHub Actions job that SSHed in
# over the Cloudflare tunnel, which was the most fragile part of the system: a
# healthy tunnel serving the site would still refuse the SSH hostname at the
# edge, and a deploy was blocked whenever that happened. This inverts it.
# Nothing needs to reach in; the NAS asks GitHub whether main has moved and acts
# on the answer.
#
# It also keeps the secrets at home. The old push deploy rewrote .env on every
# run, piping the database password, Django secret key and tunnel token through
# a GitHub Actions command line, so GitHub had to hold all of them. Here .env is
# expected to already exist and is never touched.
#
# Safe to run on a short schedule: it exits immediately when the local checkout
# already matches origin, and flock keeps two runs from overlapping.
#
# Install (adjust the path to wherever this repository lives). Pipe it in
# rather than using `crontab -e`: with no EDITOR set, which is the default on
# this NAS, the editor exits in a way crontab treats as an abort. It then
# prints "edits left in /tmp/crontab.XXXX/crontab" and installs NOTHING, which
# reads like a note about a saved backup rather than a failure. That silence
# cost a day of deploys that were never scheduled.
#
#     line='*/5 * * * * /volume2/docker/moneda-bio/scripts/nas-pull-deploy.sh'
#     ( crontab -l 2>/dev/null | grep -Fv 'nas-pull-deploy.sh'; echo "$line" ) | crontab -
#     crontab -l            # MUST echo the job back; empty means nothing installed
#
# Then check a daemon is actually running to execute it -- an installed crontab
# with no cron daemon is indistinguishable from no crontab at all:
#
#     pgrep -x crond || pgrep -x cron || echo "NO CRON DAEMON RUNNING"
#
# Configure with environment variables if the defaults do not fit:
#
#     REPO_DIR   checkout to deploy      (default: this script's parent)
#     BRANCH     branch to track         (default: main)
#     LOG_FILE   where to append output  (default: <repo>/.deploy.log)
#     LOCK_FILE  lock path               (default: /tmp/moneda-bio-deploy.lock)
#     STATE_FILE last deployed commit     (default: <repo>/.deployed-sha)

set -euo pipefail

# cron runs with a near-empty PATH, so docker and git are frequently not found
# when the same script that works in a login shell runs on a schedule. Prepend
# the usual locations rather than relying on the caller's environment.
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin${PATH:+:$PATH}"
export PATH

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

REPO_DIR="${REPO_DIR:-$(dirname -- "$SCRIPT_DIR")}"
BRANCH="${BRANCH:-main}"
LOG_FILE="${LOG_FILE:-$REPO_DIR/.deploy.log}"
LOCK_FILE="${LOCK_FILE:-/tmp/moneda-bio-deploy.lock}"

# Records the commit whose images were actually built, started and reported
# healthy. Deliberately NOT the checkout's HEAD: HEAD says which source is on
# disk, which is not the same question. Two ways they diverge, both seen:
#
#   - Someone runs `git reset --hard origin/main` by hand (installing this
#     script in the first place requires exactly that). HEAD now matches
#     origin, so a HEAD-based check concludes there is nothing to do and the
#     containers keep serving the previous image forever.
#   - A deploy resets the checkout and then fails in `docker compose build`.
#     HEAD again matches origin, so the next run skips the retry and the
#     failure is silent and permanent.
#
# A marker written only after a health check has neither hole.
STATE_FILE="${STATE_FILE:-$REPO_DIR/.deployed-sha}"

# Git refuses to touch a repository owned by another user ("detected dubious
# ownership") since 2.35.2. That bites here whenever the schedule runs as a
# different user than the one who owns the checkout -- installing the cron job
# on this NAS needs root, while the checkout belongs to the login account, so
# the common case is the broken one. Every git call below would fail, and the
# deploy would report a network problem it does not have.
#
# Scoped to this one path and to this process only: narrower than the global
# `git config --global --add safe.directory` that git's own error suggests,
# and it leaves no state behind on the machine.
export GIT_CONFIG_COUNT=1
export GIT_CONFIG_KEY_0=safe.directory
export GIT_CONFIG_VALUE_0="$REPO_DIR"

# Services the deploy owns. cloudflared is deliberately absent: recreating it
# drops the tunnel that serves the site, and nothing here needs it restarted.
SERVICES=(db backend frontend)

# Images that have to be built. Built one at a time on purpose -- building them
# concurrently starved webpack on this host, which died mid-compile with no
# output while pip install ran beside it.
BUILD_SERVICES=(backend frontend)

HEALTH_CONTAINER="${HEALTH_CONTAINER:-bio-frontend}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"

log() {
    printf '%s  %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" | tee -a "$LOG_FILE"
}

die() {
    log "ERROR: $*"
    exit 1
}

# Wait for the frontend to report healthy, using the HEALTHCHECK baked into its
# image. A deploy that leaves the site down should fail loudly rather than
# report success and move on.
wait_for_health() {
    local container="$1" deadline=$((SECONDS + HEALTH_TIMEOUT)) status

    if ! docker inspect "$container" >/dev/null 2>&1; then
        log "No container named $container to health-check; skipping."
        return 0
    fi

    # An image without a HEALTHCHECK reports no Health object at all.
    if [ -z "$(docker inspect --format '{{if .State.Health}}yes{{end}}' "$container" 2>/dev/null)" ]; then
        log "$container has no healthcheck; skipping."
        return 0
    fi

    while [ "$SECONDS" -lt "$deadline" ]; do
        status="$(docker inspect --format '{{.State.Health.Status}}' "$container" 2>/dev/null || echo unknown)"
        case "$status" in
            healthy)   log "$container is healthy."; return 0 ;;
            unhealthy) die "$container reported unhealthy after deploy." ;;
        esac
        sleep 5
    done

    die "$container did not become healthy within ${HEALTH_TIMEOUT}s."
}

deploy() {
    cd "$REPO_DIR" || die "Cannot enter $REPO_DIR"

    # Named explicitly so a scheduled run fails with the missing tool rather
    # than an obscure "command not found" halfway through.
    local tool
    for tool in git docker flock; do
        command -v "$tool" >/dev/null 2>&1 || die "$tool is not on PATH. Scheduled runs need it; PATH is: $PATH"
    done

    [ -d .git ] || die "$REPO_DIR is not a git checkout."

    # Not fatal, but worth saying once per deploy: a run as root rewrites files
    # in a checkout owned by someone else, so the owner may later find bits of
    # their own repository no longer writable by them.
    local repo_uid me
    repo_uid="$(stat -c '%u' "$REPO_DIR" 2>/dev/null || echo unknown)"
    me="$(id -u)"
    if [ "$repo_uid" != "unknown" ] && [ "$repo_uid" != "$me" ]; then
        log "NOTE: running as uid $me against a checkout owned by uid $repo_uid; files this deploy writes will belong to uid $me."
    fi
    [ -f .env ] || die ".env is missing. It holds the database password, Django secret key and tunnel token, and this script never creates it."

    # Report what git actually said. This used to read "Is the network up?",
    # which sent the investigation in the wrong direction the one time it fired.
    local fetch_err
    if ! fetch_err="$(git fetch --quiet origin "$BRANCH" 2>&1)"; then
        die "git fetch failed: ${fetch_err:-no output}"
    fi

    local deployed target
    target="$(git rev-parse "origin/$BRANCH")"
    deployed="$(cat "$STATE_FILE" 2>/dev/null || true)"

    if [ "$deployed" = "$target" ]; then
        # Quiet on purpose: this is the common case on a short schedule, and a
        # log line every few minutes buries the deploys that matter.
        return 0
    fi

    if [ -n "$deployed" ]; then
        log "=== Deploying ${deployed:0:7} -> ${target:0:7} on $BRANCH ==="
        git log --oneline "${deployed}..${target}" 2>/dev/null | sed 's/^/    /' | tee -a "$LOG_FILE" || true
    else
        # No marker: first run after installing this script, or after the state
        # file was removed. Build unconditionally rather than assume the
        # running containers match origin -- that assumption is the bug this
        # file exists to avoid.
        log "=== Deploying ${target:0:7} on $BRANCH (no previous deploy recorded) ==="
    fi

    # Matches the push deploy: the checkout is a deployment target, not a
    # workspace, so local edits are discarded rather than merged.
    git reset --hard "origin/$BRANCH" >>"$LOG_FILE" 2>&1 || die "git reset failed."

    local service
    for service in "${BUILD_SERVICES[@]}"; do
        log "Building $service..."
        docker compose build "$service" >>"$LOG_FILE" 2>&1 || die "Build failed for $service. See $LOG_FILE."
    done

    log "Starting ${SERVICES[*]}..."
    docker compose up -d "${SERVICES[@]}" >>"$LOG_FILE" 2>&1 || die "docker compose up failed. See $LOG_FILE."

    wait_for_health "$HEALTH_CONTAINER"

    # Only now is this commit genuinely deployed. Anything that exits earlier
    # leaves the marker alone, so the next run retries instead of assuming.
    printf '%s\n' "$target" > "$STATE_FILE"

    log "=== Deployed ${target:0:7} ==="
}

# Overlapping runs would fight over the checkout and the Docker build cache.
# -n so a run that arrives mid-deploy gives up rather than queueing.
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
    exit 0
fi

deploy
