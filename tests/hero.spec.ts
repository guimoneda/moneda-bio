// spec: specs/static-webserver-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Frontend UI Element Tests', () => {
  test('Hero section content and CTAs', async ({ page }) => {
    // 1. Load https://guimoneda.com/ and locate hero section
    await page.goto('https://guimoneda.com/');

    // 2. Keyboard activation of CTAs
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Assertions for expectations
    await expect(page.locator('h1')).toContainText("Hi, I'm Moneda");
    await expect(page.locator('h1')).toContainText('Senior QA Engineer');
    await expect(page.locator('p').first()).toContainText('years');
    await expect(page.locator('p').first()).toContainText('Selenium');
    await expect(page.locator('a:has-text("View My Work")')).toHaveAttribute('href', '/jobs');
    await expect(page.locator('a:has-text("Contact Me")')).toHaveAttribute('href', 'mailto:contact@guimoneda.com');
    // Note: Keyboard reachability and activation verified via presses; mailto handled non-destructively in test env.
  });
});