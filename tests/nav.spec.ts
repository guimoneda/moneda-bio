// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Navigation and header links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navbar')).toBeVisible();
    await expect(page.getByTestId('brand')).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Index', exact: false })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Experience', exact: false }).first()).toHaveAttribute(
      'href',
      '/jobs'
    );
    await expect(page.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin/');
  });

  test('Skip link is the first focusable element', async ({ page }) => {
    await page.goto('/');
    // Wait for hydration — a Tab pressed against the bare HTML shell goes nowhere.
    await expect(page.getByTestId('brand')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  test('Theme toggle switches between ink and paper', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('brand')).toBeVisible();
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');

    await page.getByTestId('theme-toggle').click();
    await expect(html).not.toHaveAttribute('data-theme', before as string);

    // The choice survives a reload.
    const after = await html.getAttribute('data-theme');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', after as string);
  });

  test('Mobile menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByTestId('menu-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.getByTestId('mobile-menu').getByRole('link', { name: 'Experience' }).click();
    await expect(page).toHaveURL(/\/jobs$/);
    await expect(page.getByTestId('mobile-menu')).toHaveCount(0);
  });
});
