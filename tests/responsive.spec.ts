// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const vp of viewports) {
  test.describe(`Responsive layout — ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const path of ['/', '/jobs']) {
      test(`${path} loads without horizontal scroll`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
      });
    }

    test('Navbar and brand are visible', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByTestId('navbar')).toBeVisible();
      await expect(page.getByTestId('brand')).toBeVisible();
    });

    test('Hero h1 is visible and names the owner', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('h1')).toContainText('Moneda');
    });

    test('Primary CTA "View My Work" is visible', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('link', { name: 'View My Work' })).toBeVisible();
    });

    test('Job rows are visible on the jobs page', async ({ page }) => {
      await page.goto('/jobs');
      const rows = page.getByTestId('job-row');
      await expect(rows.first()).toBeVisible();
      expect(await rows.count()).toBeGreaterThanOrEqual(1);
    });

    test('Navigation is reachable at this width', async ({ page }) => {
      await page.goto('/');

      // The requirement is that navigation is reachable, not which form it
      // takes: inline links above the md breakpoint, behind the menu toggle
      // below it. Asserting the specific form breaks at exactly 768px, where
      // engines disagree by the width of a scrollbar over whether
      // `min-width: 768px` matches — WebKit resolved it to the mobile layout
      // while Chromium and Firefox resolved it to the desktop one.
      //
      // Which form appears at a given width is covered unambiguously by
      // nav.spec.ts, which drives the mobile menu at 390px.
      const inlineLink = page.getByRole('link', { name: 'Experience', exact: false }).first();
      const menuToggle = page.getByTestId('menu-toggle');

      await expect(inlineLink.or(menuToggle).first()).toBeVisible();
    });
  });
}
