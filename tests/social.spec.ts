// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Social links and external link safety', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
  });

  const cases = [
    { name: 'GitHub', href: 'https://github.com/guimoneda/' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/moneda/' },
    { name: 'Instagram', href: 'https://www.instagram.com/guimoneda' },
  ];

  for (const social of cases) {
    test(`${social.name} link points to the correct URL and has safe attributes`, async ({ page }) => {
      const link = page.getByTestId('social-links').getByRole('link', { name: social.name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', social.href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  }

  test('All three social links are in the footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.locator('a[href*="github.com"]')).toBeVisible();
    await expect(footer.locator('a[href*="linkedin.com"]')).toBeVisible();
    await expect(footer.locator('a[href*="instagram.com"]')).toBeVisible();
  });

  test('Footer has "Let\'s Connect" heading, contact address and copyright', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('heading', { name: /Let.s Connect/i })).toBeVisible();
    await expect(footer.locator('a[href="mailto:contact@guimoneda.com"]')).toBeVisible();
    await expect(footer).toContainText('2026 Moneda');
  });

  test('Home page links through to the full history', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Full history/i })).toHaveAttribute('href', '/jobs');
  });
});
