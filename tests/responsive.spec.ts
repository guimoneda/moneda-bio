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

    test('Home page loads without horizontal scroll', async ({ page }) => {
      await page.goto('https://guimoneda.com/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
    });

    test('Navbar is visible and usable', async ({ page }) => {
      await page.goto('https://guimoneda.com/');
      await expect(page.locator('nav')).toBeVisible();
      // Brand link always visible regardless of viewport
      await expect(page.locator('a:has-text("<Moneda />")')).toBeVisible();
    });

    test('Hero h1 is visible', async ({ page }) => {
      await page.goto('https://guimoneda.com/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('h1')).toContainText("Hi, I'm Moneda");
    });

    test('Primary CTA "View My Work" is visible', async ({ page }) => {
      await page.goto('https://guimoneda.com/');
      await expect(page.locator('a:has-text("View My Work")')).toBeVisible();
    });

    test('Jobs page loads without horizontal scroll', async ({ page }) => {
      await page.goto('https://guimoneda.com/jobs');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test('Job cards are visible on jobs page', async ({ page }) => {
      await page.goto('https://guimoneda.com/jobs');
      await page.waitForSelector('.bg-gray-800.rounded-xl');
      const cards = page.locator('.bg-gray-800.rounded-xl');
      expect(await cards.count()).toBeGreaterThanOrEqual(1);
    });
  });
}
