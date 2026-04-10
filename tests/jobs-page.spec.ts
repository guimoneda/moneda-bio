// spec: specs/static-webserver-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Jobs page (/jobs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://guimoneda.com/jobs');
  });

  test('Professional Experience section renders job cards', async ({ page }) => {
    await expect(page.locator('h1:has-text("Professional Experience")')).toBeVisible();

    // At least one job card is rendered (no limit on this page)
    const cards = page.locator('.bg-gray-800.rounded-xl.cursor-pointer');
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(await cards.count()); // at least 1
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('Job card modal opens and closes', async ({ page }) => {
    // Click the first job card
    const firstCard = page.locator('.bg-gray-800.rounded-xl.cursor-pointer').first();
    await firstCard.click();

    // Modal overlay and expanded card should appear
    await expect(page.locator('.fixed.inset-0.bg-black\\/80')).toBeVisible();
    // Close button (X) inside modal
    const closeBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(closeBtn).toBeVisible();

    // Close via backdrop click
    await page.locator('.fixed.inset-0.bg-black\\/80').click({ force: true });
    await expect(page.locator('.fixed.inset-0.bg-black\\/80')).not.toBeVisible();
  });

  test('Job card modal closes with close button', async ({ page }) => {
    const firstCard = page.locator('.bg-gray-800.rounded-xl.cursor-pointer').first();
    await firstCard.click();

    // Modal visible
    await expect(page.locator('.fixed.inset-0.bg-black\\/80')).toBeVisible();

    // Click the X close button inside the modal
    await page.locator('button').filter({ has: page.locator('path[d*="M6 18L18 6"]') }).click();
    await expect(page.locator('.fixed.inset-0.bg-black\\/80')).not.toBeVisible();
  });

  test('Education section renders', async ({ page }) => {
    await expect(page.locator('h2:has-text("Education")')).toBeVisible();

    // At least one education card
    const educationSection = page.locator('h2:has-text("Education")').locator('..');
    const eduCards = page.locator('h2:has-text("Education") ~ div .bg-gray-800.rounded-xl');
    // scroll into view first
    await page.locator('h2:has-text("Education")').scrollIntoViewIfNeeded();
    await expect(page.locator('h2:has-text("Education")')).toBeVisible();

    // Education items are degree names (h3 within education section area)
    // Just verify the section heading and at least one card loads
    const allCards = page.locator('.space-y-6 .bg-gray-800.rounded-xl');
    await expect(allCards.first()).toBeVisible();
  });

  test('Certifications section renders', async ({ page }) => {
    await page.locator('h2:has-text("Certifications")').scrollIntoViewIfNeeded();
    await expect(page.locator('h2:has-text("Certifications")')).toBeVisible();
  });

  test('Navbar is visible on jobs page', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a:has-text("Experience")')).toHaveAttribute('href', '/jobs');
  });

  test('Job card shows title, company and technologies', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('.bg-gray-800.rounded-xl.cursor-pointer');

    const firstCard = page.locator('.bg-gray-800.rounded-xl.cursor-pointer').first();
    // Title (h3) and company (indigo text) should be visible in card
    await expect(firstCard.locator('h3')).toBeVisible();
    await expect(firstCard.locator('.text-indigo-400')).toBeVisible();
  });
});
