# ---------------------------------------------------------------------------
# Build stage
#
# The previous setup shipped no image at all: the container mounted the source
# and ran `npm install && npm start`, so production was a webpack dev server
# plus a TypeScript type-checker. That is what exhausted memory on the NAS and
# crash-looped the site. Compiling here means the runtime never compiles.
# ---------------------------------------------------------------------------
FROM node:20-slim AS build

WORKDIR /app

# `npm ci` installs the lockfile exactly and fails if it has drifted, so an
# image can never resolve a tree other than the one committed. `npm install`
# was the source of the non-determinism this replaces.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# INLINE_RUNTIME_CHUNK=false keeps every byte of JS in an external file, so the
# Content-Security-Policy in nginx.conf needs no script-src exception.
ENV INLINE_RUNTIME_CHUNK=false \
    GENERATE_SOURCEMAP=false \
    DISABLE_ESLINT_PLUGIN=true \
    NODE_OPTIONS=--max-old-space-size=1024

RUN npm run build

# ---------------------------------------------------------------------------
# Serve stage
#
# nginx-unprivileged runs as a non-root user (uid 101) out of the box. Port
# 3000 is kept so the existing Cloudflare Tunnel ingress rule
# (http://bio-frontend:3000) needs no change.
# ---------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.27-alpine AS serve

# The snippet lives outside conf.d: everything in conf.d is auto-included at
# http level, which would emit every header twice.
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

# Fail the container's health check rather than silently serving nothing.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["/bin/sh", "-c", "wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1"]
