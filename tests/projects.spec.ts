// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Homepage job card modal', () => {
  test('Job card click opens and closes modal overlay', async ({ page }) => {
    await page.goto('/');
    // Wait for API data to fully load before interacting
    await page.waitForLoadState('networkidle');

    // Click the first card container (not inner text) to avoid animation timing issues
    const firstCard = page.locator('.bg-gray-800.rounded-xl.cursor-pointer').first();
    await firstCard.click();

    // Allow Framer Motion animation to settle
    const backdrop = page.locator('.fixed.inset-0.bg-black\\/80');
    await expect(backdrop).toBeVisible({ timeout: 10000 });

    // Modal contains a job title
    await expect(page.locator('.bg-gray-900.w-full.max-w-2xl h3').first()).toBeVisible();

    // Close modal by clicking backdrop
    // force: true needed because the sticky navbar (z-50) sits above the backdrop (z-40)
    await backdrop.click({ force: true });
    await expect(backdrop).not.toBeVisible({ timeout: 10000 });
  });
});