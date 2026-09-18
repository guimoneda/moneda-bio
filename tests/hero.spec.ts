// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Hero section content and CTAs', async ({ page }) => {
    await page.goto('/');

    const hero = page.getByTestId('hero');
    await expect(hero).toBeVisible();

    await expect(page.locator('h1')).toContainText('Guilherme');
    await expect(page.locator('h1')).toContainText('Moneda');
    await expect(page.locator('h1')).toContainText('Senior QA Engineer');

    const statement = hero.locator('p').filter({ hasText: 'Selenium' });
    await expect(statement).toContainText('years');
    await expect(statement).toContainText('Selenium');

    await expect(page.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '/jobs');
    await expect(page.getByRole('link', { name: 'Contact Me' })).toHaveAttribute(
      'href',
      'mailto:contact@guimoneda.com'
    );
  });

  test('Hero figures are derived from the API, not hard-coded', async ({ page }) => {
    const jobs = await page.request.get('/api/jobs/').then((r) => r.json());
    const technologies = new Set<string>(
      jobs.flatMap((job: { technologies?: string[] }) => job.technologies ?? [])
    );

    await page.goto('/');
    const hero = page.getByTestId('hero');
    await expect(hero.getByText('Roles held').locator('..')).toContainText(String(jobs.length));
    await expect(hero.getByText('Technologies').locator('..')).toContainText(String(technologies.size));
  });
});
