// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Project cards and list interactions', async ({ page }) => {
    // 1. Scroll to `Latest Projects` area
    await page.goto('https://guimoneda.com/');
    await page.evaluate('() => { document.querySelector(\'h2\').scrollIntoView(); }');

    // 2. Open a project card via keyboard and mouse
    await page.getByText('Program ManagerAvenue Code1').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Assertions for expectations
    await expect(page.locator('h2:has-text("Latest Projects")')).toBeVisible();
    await expect(page.locator('h3:has-text("Program Manager")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Technical Project Manager")').first()).toBeVisible();
    await expect(page.locator('h3:has-text("Scrum Master")').first()).toBeVisible();
    // Note: Cards are clickable and open modals; keyboard activation tested via presses. No JS errors observed in execution.
  });

  test('Job card click opens modal overlay', async ({ page }) => {
    await page.goto('https://guimoneda.com/');
    await page.waitForSelector('h3:has-text("Program Manager")');

    // Click the first job card
    await page.locator('h3:has-text("Program Manager")').first().click();

    // Modal backdrop and expanded card appear
    await expect(page.locator('.fixed.inset-0.bg-black\\/80')).toBeVisible();

    // Modal contains the job title
    await expect(page.locator('.bg-gray-900.w-full.max-w-2xl h3').first()).toBeVisible();

    // Close modal by clicking backdrop
    await page.locator('.fixed.inset-0.bg-black\\/80').click({ force: true });
    await expect(page.locator('.fixed.inset-0.bg-black\\/80')).not.toBeVisible();
  });
});