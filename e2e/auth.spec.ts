import { test, expect } from '@playwright/test';

test.describe('Authentication and Authorization', () => {
  const newUser = {
    email: `testuser_${Date.now()}@crealia.com`,
    password: 'Password123!',
  };

  test('should allow a user to sign up', async ({ page }) => {
    await page.goto('/auth/signup'); // Assuming a signup page exists
    
    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="password"]', newUser.password);
    await page.click('button[type="submit"]');

    // Expect to be redirected to a post-signup page, like onboarding or login
    await expect(page).toHaveURL(/onboarding|signin/);
  });

  test('should allow a user to log in', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="password"]', newUser.password);
    await page.click('button[type="submit"]');

    // After login, user should be redirected to the dashboard or studio
    await expect(page).toHaveURL(/dashboard|studio/);
    
    // Check if the session cookie is set
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('next-auth.session-token'));
    expect(sessionCookie).toBeDefined();
  });

  test('should protect routes from unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Expect to be redirected to the sign-in page
    await expect(page).toHaveURL(/signin/);
  });

  test('should allow a logged-in user to access protected routes and then log out', async ({ page }) => {
    // First, log in the user (steps from the login test)
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="password"]', newUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard|studio/);

    // Now, access a protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/dashboard/); // Should stay on the dashboard

    // Find and click a logout button
    // This selector is a guess and will likely need to be adjusted
    await page.click('button:has-text("Logout"), button:has-text("Déconnexion")');

    // After logout, user should be redirected to the homepage or sign-in page
    await expect(page).not.toHaveURL(/dashboard/);
    await expect(page).toHaveURL(/\/|.*signin/);
  });
});
