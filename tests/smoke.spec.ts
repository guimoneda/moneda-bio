// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Automated UI smoke test', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navbar')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'View My Work' })).toBeVisible();

    // The home page shows the three most recent roles as index rows.
    const rows = page.getByTestId('job-row');
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toBeVisible();

    // Social links live in the footer, so scroll them into view first.
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator('a[href*="github.com"]')).toBeVisible();
    await expect(footer.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(footer.locator('a[href*="instagram.com"]')).toBeVisible();
  });
});
