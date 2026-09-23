#!/usr/bin/env bash
#
# Pull-based deploy, run on the NAS itself.
#
# The push-based path in .github/workflows/docker-image.yml requires GitHub to
# reach into the house over a Cloudflare tunnel, which has proven to be the most
# fragile part of the system: a healthy tunnel serving the site has still
# refused the SSH hostname at the edge, and a deploy is blocked whenever that
# happens. This inverts it. Nothing needs to reach in; the NAS asks GitHub
# whether main has moved and acts on the answer.
#
# It also keeps the secrets at home. The push deploy rewrites .env on every run,
# piping the database password, Django secret key and tunnel token through a
# GitHub Actions command line. Here .env is expected to already exist and is
# never touched.
#
# Safe to run on a short schedule: it exits immediately when the local checkout
# already matches origin, and flock keeps two runs from overlapping.
#
# Install (adjust the path to wherever this repository lives):
#
#     */5 * * * * /volume2/docker/moneda-bio/scripts/nas-pull-deploy.sh
#
# Configure with environment variables if the defaults do not fit:
#
#     REPO_DIR   checkout to deploy      (default: this script's parent)
#     BRANCH     branch to track         (default: main)
#     LOG_FILE   where to append output  (default: <repo>/.deploy.log)
#     LOCK_FILE  lock path               (default: /tmp/moneda-bio-deploy.lock)

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

REPO_DIR="${REPO_DIR:-$(dirname -- "$SCRIPT_DIR")}"
BRANCH="${BRANCH:-main}"
LOG_FILE="${LOG_FILE:-$REPO_DIR/.deploy.log}"
LOCK_FILE="${LOCK_FILE:-/tmp/moneda-bio-deploy.lock}"

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

    [ -d .git ] || die "$REPO_DIR is not a git checkout."
    [ -f .env ] || die ".env is missing. It holds the database password, Django secret key and tunnel token, and this script never creates it."

    git fetch --quiet origin "$BRANCH" || die "git fetch failed. Is the network up?"

    local current target
    current="$(git rev-parse HEAD)"
    target="$(git rev-parse "origin/$BRANCH")"

    if [ "$current" = "$target" ]; then
        # Quiet on purpose: this is the common case on a short schedule, and a
        # log line every few minutes buries the deploys that matter.
        return 0
    fi

    log "=== Deploying ${current:0:7} -> ${target:0:7} on $BRANCH ==="
    git log --oneline "${current}..${target}" 2>/dev/null | sed 's/^/    /' | tee -a "$LOG_FILE" || true

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

    log "=== Deployed ${target:0:7} ==="
}

# Overlapping runs would fight over the checkout and the Docker build cache.
# -n so a run that arrives mid-deploy gives up rather than queueing.
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
    exit 0
fi

deploy
