import { test, expect } from '@playwright/test';

test.describe('Stripe Checkout Flow', () => {
  const user = {
    email: 'test@crealia.com', // Assume this user exists in your test database
    password: 'Password123!',
  };

  // Authenticate once before running the tests
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should redirect to Stripe checkout when a plan is selected', async ({ page }) => {
    // 1. Navigate to the pricing page
    await page.goto('/pricing');
    
    // 2. Click the "buy" button for a specific plan.
    // The selector needs to be specific enough to target one plan.
    // Using a data-testid attribute is the most robust approach.
    // e.g., <button data-testid="buy-pro-plan">...</button>
    const proPlanButton = page.locator('[data-testid="buy-pro-plan"]');
    
    // Fallback selectors if data-testid is not available
    // const proPlanButton = page.locator('div:has-text("Pro Plan") >> button:has-text("Buy")');
    
    await expect(proPlanButton).toBeVisible();

    // 3. Click the button and wait for the navigation to a Stripe URL
    await proPlanButton.click();
    
    // Wait for the page URL to change to the Stripe checkout page
    await page.waitForURL('https://checkout.stripe.com/**', { timeout: 15000 });
    
    // 4. Assert that the current URL is a Stripe checkout URL
    const currentUrl = page.url();
    expect(currentUrl).toContain('https://checkout.stripe.com/');
  });
});
