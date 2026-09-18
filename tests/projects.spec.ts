// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Homepage job detail', () => {
  test('Row click opens the detail panel and returns focus on close', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const trigger = page.getByTestId('job-row').first().getByRole('button');
    await trigger.click();

    const detail = page.getByTestId('job-detail');
    await expect(detail).toBeVisible({ timeout: 10000 });
    await expect(detail.locator('h3').first()).toBeVisible();

    // Closing hands focus back to the row that opened the panel, so keyboard
    // users are not dropped at the top of the document.
    await page.getByTestId('job-detail-close').click();
    await expect(detail).toHaveCount(0, { timeout: 10000 });
    await expect(trigger).toBeFocused();
  });

  test('Background scroll is locked while the detail panel is open', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('job-row').first().getByRole('button').click();
    await expect(page.getByTestId('job-detail')).toBeVisible();

    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  });
});
