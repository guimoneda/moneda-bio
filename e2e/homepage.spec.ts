import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Moneda/);
});

test('Check View My Work Button', async ({ page }) => {
  await page.goto('/');

  // Click the get started link.
  await page.getByRole('link', { name: 'View My Work' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Professional Experience' })).toBeVisible();
});

test('Check mailto link details', async ({ page }) => {
  await page.goto('/');

// Example: Asserting static mailto link
await expect(page.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', 'mailto:contact@guimoneda.com');
});

});
