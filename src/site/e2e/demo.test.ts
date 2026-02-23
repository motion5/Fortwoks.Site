import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('heading', { name: /SvelteKit Starter/i })).toBeVisible();
});

test('landing page displays all main sections', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Features/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Svelte 5 Runes in Action/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Project Structure/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Getting Started/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Testing Built In/i })).toBeVisible();
});

test('runes demo tabs are interactive', async ({ page }) => {
    await page.goto('/');

    const derivedTab = page.getByRole('button', { name: /Derived Values/i });
    await derivedTab.click();
    await expect(derivedTab).toHaveClass(/active/);

    const effectTab = page.getByRole('button', { name: /Side Effects/i });
    await effectTab.click();
    await expect(effectTab).toHaveClass(/active/);
});

test('call-to-action buttons are visible', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Get Started/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /View on GitHub/i })).toBeVisible();
});
