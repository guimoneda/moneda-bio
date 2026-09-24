// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Jobs page (/jobs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jobs');
  });

  test('Professional Experience section renders job rows', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Professional Experience');

    const rows = page.getByTestId('job-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('Job detail opens from a row and closes on the backdrop', async ({ page }) => {
    await page.getByTestId('job-row').first().getByRole('button').click();

    await expect(page.getByTestId('job-detail')).toBeVisible();
    await expect(page.getByTestId('job-backdrop')).toBeVisible();

    await page.getByTestId('job-backdrop').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('job-detail')).toHaveCount(0);
  });

  test('Job detail closes with the close button', async ({ page }) => {
    await page.getByTestId('job-row').first().getByRole('button').click();
    await expect(page.getByTestId('job-detail')).toBeVisible();

    await page.getByTestId('job-detail-close').click();
    await expect(page.getByTestId('job-detail')).toHaveCount(0);
  });

  test('Job detail closes with the Escape key', async ({ page }) => {
    await page.getByTestId('job-row').first().getByRole('button').click();
    await expect(page.getByTestId('job-detail')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('job-detail')).toHaveCount(0);
  });

  test('Education section renders', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Education' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    const rows = page.getByTestId('education-index').locator('li');
    // toBeVisible() first, then count. locator.count() is a one-shot query and
    // does not retry, so counting first races the fetch that fills this list:
    // the heading above is static markup and paints immediately, while the rows
    // arrive with /api/education/. Against production that race is
    // real and intermittent -- it failed one run and came back flaky the next.
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('Certifications section renders', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'Certifications' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    const rows = page.getByTestId('certification-index').locator('li');
    // toBeVisible() first, then count. locator.count() is a one-shot query and
    // does not retry, so counting first races the fetch that fills this list:
    // the heading above is static markup and paints immediately, while the rows
    // arrive with /api/certification/. Against production that race is
    // real and intermittent -- it failed one run and came back flaky the next.
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });
});
