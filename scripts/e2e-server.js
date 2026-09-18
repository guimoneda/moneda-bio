#!/usr/bin/env node
/*
 * Serves the compiled frontend plus a stubbed read-only API, so the Playwright
 * suite can exercise the code in the branch instead of whatever happens to be
 * deployed at guimoneda.com.
 *
 * It deliberately mirrors what nginx does in production (see
 * frontend/nginx.conf): static files if they exist, index.html for anything
 * else so client-side routing resolves. The API routes stand in for the
 * Cloudflare Tunnel ingress rules that send /api to the Django container.
 *
 * No dependencies: it runs from a bare checkout with only Node available.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'frontend', 'build');
const FIXTURES = path.resolve(__dirname, '..', 'tests', 'fixtures');
const PORT = Number(process.env.E2E_PORT || 4173);
const HOST = process.env.E2E_HOST || '127.0.0.1';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
};

const readFixture = (name) =>
  JSON.parse(fs.readFileSync(path.join(FIXTURES, `${name}.json`), 'utf8'));

const API = {
  '/api/jobs/': () => readFixture('jobs'),
  '/api/education/': () => readFixture('education'),
  '/api/certifications/': () => readFixture('certifications'),
};

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error(
    `[e2e-server] No build found at ${ROOT}.\n` +
      `[e2e-server] Run "npm run build" in frontend/ first.`
  );
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];

  const api = API[url];
  if (api) {
    const body = JSON.stringify(api());
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    });
    return res.end(body);
  }

  // Anything else under /api is a 404, matching a real API rather than
  // silently falling through to index.html and confusing a failing test.
  if (url.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end('{"detail":"Not found."}');
  }

  // Resolve inside ROOT only: a request for ../../etc/passwd must not escape.
  const requested = path.normalize(path.join(ROOT, decodeURIComponent(url)));
  const inRoot = requested === ROOT || requested.startsWith(ROOT + path.sep);

  let file = requested;
  if (!inRoot || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(ROOT, 'index.html'); // SPA fallback, as nginx does
  }

  res.writeHead(200, {
    'Content-Type': CONTENT_TYPES[path.extname(file)] || 'application/octet-stream',
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`[e2e-server] serving ${ROOT} on http://${HOST}:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
