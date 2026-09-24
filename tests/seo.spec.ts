// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

// Filters out known third-party / browser-quirk errors that are not app bugs
const KNOWN_EXTERNAL_PATTERNS = [
  'favicon',
  'cloudflare',
  'cloudflareinsights',
  'integrity',
  'CORS',
  'Cross-Origin',
  'bad URL',                  // WebKit: some resource load quirk
  'Failed to load resource',  // Network-level errors from third-party resources
];

// Cloudflare's JavaScript Detections injects an inline bootstrap for
// /cdn-cgi/challenge-platform/scripts/jsd/main.js into every HTML response.
// Our CSP has no 'unsafe-inline', so the browser refuses it -- correctly: the
// script is not ours and is not served from our origin.
//
// It cannot be turned off. On the free plan JavaScript Detections is bound to
// Bot Fight Mode with no independent switch, and a CSP hash is impossible
// because the injected body carries per-request r/t parameters, so its hash
// differs on every load.
//
// Matched by concept rather than by phrase, because every engine words it
// differently and the wording is not stable even within one engine:
//
//   Chromium  Executing inline script violates the following Content Security
//             Policy directive 'script-src 'self''...
//   WebKit    Refused to execute a script because its hash, its nonce, or
//             'unsafe-inline' does not appear in the script-src directive...
//   Firefox   Content-Security-Policy: The page's settings blocked an inline
//             script (script-src-elem) from being executed...
//
// An earlier version of this filter keyed on one Chromium phrasing and matched
// none of the three in CI.
//
// Deliberately requires an INLINE marker: a CSP refusal of an external script
// stays a failure, because that would be our own code loading something the
// policy forbids. And this says nothing about WHOSE inline script was refused,
// so the "serves no inline script of its own" test below closes that gap from
// the other side.
function isInlineScriptCspRefusal(msg: string): boolean {
  if (!/content.security.policy/i.test(msg)) return false;
  return /inline script/i.test(msg)          // Chromium, Firefox
    || /its hash, its nonce/i.test(msg);     // WebKit's wording for the same thing
}

function isAppError(msg: string): boolean {
  if (isInlineScriptCspRefusal(msg)) return false;
  return !KNOWN_EXTERNAL_PATTERNS.some(p => msg.includes(p));
}

test.describe('SEO and metadata', () => {
  test('Home page has a descriptive <title>', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Home page has a single h1', async ({ page }) => {
    await page.goto('/');
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });

  test('Heading hierarchy uses h2/h3 appropriately on home page', async ({ page }) => {
    await page.goto('/');
    // h2 "Selected Work" is present
    await expect(page.getByRole('heading', { level: 2, name: 'Selected Work' })).toBeVisible();
    // Job cards use h3 — wait for API data to load before counting
    await page.waitForSelector('h3', { timeout: 10000 });
    const h3s = page.locator('h3');
    expect(await h3s.count()).toBeGreaterThanOrEqual(1);
  });

  test('Jobs page has a single h1 "Professional Experience"', async ({ page }) => {
    await page.goto('/jobs');
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toContainText('Professional Experience');
  });

  test('No JavaScript console errors on home page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const fatalErrors = errors.filter(isAppError);
    expect(fatalErrors).toHaveLength(0);
  });

  test('No JavaScript console errors on jobs page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');
    const fatalErrors = errors.filter(isAppError);
    expect(fatalErrors).toHaveLength(0);
  });

  // Guards what the 'Refused to execute inline script' filter above gives up.
  // That filter cannot tell our inline script from Cloudflare's, so this
  // asserts on the served HTML instead: every inline block must be the
  // challenge-platform bootstrap Cloudflare injects at the edge. If our own
  // build ever starts emitting inline JS -- losing INLINE_RUNTIME_CHUNK=false
  // in frontend/Dockerfile would do it -- this fails even though the console
  // error is now filtered.
  test('The app serves no inline script of its own', async ({ page }) => {
    const html = await page.request.get('/').then((r) => r.text());

    const inlineBodies = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => m[1].trim())
      .filter(Boolean);

    const notCloudflare = inlineBodies.filter((body) => !body.includes('challenge-platform'));
    expect(notCloudflare).toEqual([]);
  });
});
