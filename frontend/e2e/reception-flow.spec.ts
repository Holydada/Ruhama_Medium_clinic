import { test, expect } from '@playwright/test';

const email = process.env.E2E_RECEPTION_EMAIL?.trim();
const password = process.env.E2E_RECEPTION_PASSWORD?.trim();

test.describe('Reception smoke path', () => {
  test.skip(!email || !password, 'Set E2E_RECEPTION_EMAIL and E2E_RECEPTION_PASSWORD to run this test.');

  test('login → repeat visit → payment screens', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email Address').fill(email!);
    await page.getByLabel('Password').fill(password!);
    await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

    await page.waitForURL(/receptionist-dashboard|\/reception(\/|$)/, { timeout: 30_000 });

    await page.goto('/reception/repeat-visit');
    await expect(page.getByRole('heading', { name: 'Repeat Visit' })).toBeVisible();

    await page.goto('/reception/payment');
    await expect(page.getByRole('heading', { name: 'Payment Collection' })).toBeVisible();
  });
});
