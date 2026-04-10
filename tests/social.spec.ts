// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Social links and external link safety', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://guimoneda.com/');
  });

  test('GitHub link points to correct URL and has safe attributes', async ({ page }) => {
    const gh = page.locator('a[href*="github.com"]').first();
    await expect(gh).toBeVisible();
    await expect(gh).toHaveAttribute('href', 'https://github.com/guimoneda/');
    await expect(gh).toHaveAttribute('target', '_blank');
    await expect(gh).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('LinkedIn link points to correct URL and has safe attributes', async ({ page }) => {
    const li = page.locator('a[href*="linkedin.com"]').first();
    await expect(li).toBeVisible();
    await expect(li).toHaveAttribute('href', 'https://www.linkedin.com/in/moneda/');
    await expect(li).toHaveAttribute('target', '_blank');
    await expect(li).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Instagram link points to correct URL and has safe attributes', async ({ page }) => {
    const ig = page.locator('a[href*="instagram.com"]').first();
    await expect(ig).toBeVisible();
    await expect(ig).toHaveAttribute('href', 'https://www.instagram.com/guimoneda');
    await expect(ig).toHaveAttribute('target', '_blank');
    await expect(ig).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('All three social links are in the footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.locator('a[href*="github.com"]')).toBeVisible();
    await expect(footer.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(footer.locator('a[href*="instagram.com"]')).toBeVisible();
  });

  test('Footer has "Let\'s Connect" heading and copyright text', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.locator('h2:has-text("Let\'s Connect")')).toBeVisible();
    await expect(footer.locator('text=2026 Moneda')).toBeVisible();
  });

  test('Home page has "View Full History" link pointing to /jobs', async ({ page }) => {
    await expect(page.locator('a:has-text("View Full History")')).toHaveAttribute('href', '/jobs');
  });
});
