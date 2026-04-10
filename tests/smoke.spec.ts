// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Automated UI smoke test', async ({ page }) => {
    // 1. Visit homepage and run a short smoke list: presence of nav, hero h1, primary CTA, three project cards, and footer social links
    await page.goto('https://guimoneda.com/');

    // Assertions for expectations
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a:has-text("View My Work")')).toBeVisible();
    await expect(page.locator('h3:has-text("Program Manager")')).toBeVisible();
    await expect(page.locator('h3:has-text("Technical Project Manager")')).toBeVisible();
    await expect(page.locator('h3:has-text("Scrum Master")')).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(page.locator('a[href*="instagram.com"]')).toBeVisible();
    // Note: No JavaScript console errors at page load (warnings present but non-fatal).
  });
});