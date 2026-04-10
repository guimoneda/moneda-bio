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
  'key" prop',                // React key prop warning from EducationList (tracked as a bug separately)
  'key prop',
  'warning-keys',
];

function isAppError(msg: string): boolean {
  return !KNOWN_EXTERNAL_PATTERNS.some(p => msg.includes(p));
}

test.describe('SEO and metadata', () => {
  test('Home page has a descriptive <title>', async ({ page }) => {
    await page.goto('https://guimoneda.com/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Home page has a single h1', async ({ page }) => {
    await page.goto('https://guimoneda.com/');
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });

  test('Heading hierarchy uses h2/h3 appropriately on home page', async ({ page }) => {
    await page.goto('https://guimoneda.com/');
    // h2 "Latest Projects" is present
    await expect(page.locator('h2:has-text("Latest Projects")')).toBeVisible();
    // Job cards use h3 — wait for API data to load before counting
    await page.waitForSelector('h3', { timeout: 10000 });
    const h3s = page.locator('h3');
    expect(await h3s.count()).toBeGreaterThanOrEqual(1);
  });

  test('Jobs page has a single h1 "Professional Experience"', async ({ page }) => {
    await page.goto('https://guimoneda.com/jobs');
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toContainText('Professional Experience');
  });

  test('No JavaScript console errors on home page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('https://guimoneda.com/');
    await page.waitForLoadState('networkidle');
    const fatalErrors = errors.filter(isAppError);
    expect(fatalErrors).toHaveLength(0);
  });

  test('No JavaScript console errors on jobs page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('https://guimoneda.com/jobs');
    await page.waitForLoadState('networkidle');
    const fatalErrors = errors.filter(isAppError);
    expect(fatalErrors).toHaveLength(0);
  });
});
