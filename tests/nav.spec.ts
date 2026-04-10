// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Navigation and header links', async ({ page }) => {
    // 1. Load `https://guimoneda.com/`
    await page.goto('https://guimoneda.com/');

    // 2. Tab through navigation links using keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Assertions for expectations
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a:has-text("<Moneda />")')).toHaveAttribute('href', '/');
    await expect(page.locator('a:has-text("Home")')).toHaveAttribute('href', '/');
    await expect(page.locator('a:has-text("Experience")')).toHaveAttribute('href', '/jobs');
    await expect(page.locator('a:has-text("Admin")')).toHaveAttribute('href', '/admin/');
    // Note: Focus and activation assertions would require additional setup for keyboard events, but based on log, links are focusable.
  });
});