import { test, expect } from "@playwright/test";

test.describe("Affiliate Flow", () => {
  test("user can access affiliate page and see CTA", async ({ page }) => {
    await page.goto("http://localhost:3000/affiliate");
    await expect(page.locator("text=Programme d'affiliation")).toBeVisible();
    await expect(
      page.locator("text=30% de commission")
    ).toBeVisible();
  });

  test("coming soon pages render correctly", async ({ page }) => {
    // Test iOS page
    await page.goto("http://localhost:3000/apps/ios");
    await expect(page.locator("text=iOS - Coming Soon")).toBeVisible();

    // Test Android page
    await page.goto("http://localhost:3000/apps/android");
    await expect(page.locator("text=Android - Coming Soon")).toBeVisible();

    // Test Community page
    await page.goto("http://localhost:3000/help/community");
    await expect(page.locator("text=Communauté - Coming Soon")).toBeVisible();
  });

  test("affiliate dashboard requires authentication", async ({ page }) => {
    await page.goto("http://localhost:3000/affiliate/dashboard");
    // Should show login prompt or redirect
    await expect(
      page.locator("text=Connectez-vous pour accéder")
    ).toBeVisible({ timeout: 5000 });
  });
});

