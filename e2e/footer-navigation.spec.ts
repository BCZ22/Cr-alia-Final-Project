import { test, expect } from "@playwright/test";

test.describe("Footer Navigation", () => {
  test("footer contains affiliate links", async ({ page }) => {
    await page.goto("http://localhost:3000");
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for affiliate program link
    const affiliateLink = page.locator('footer a[href="/affiliate"]');
    await expect(affiliateLink).toBeVisible();
    await expect(affiliateLink).toHaveText("Programme d'affiliation");
    
    // Check for dashboard link
    const dashboardLink = page.locator('footer a[href="/affiliate/dashboard"]');
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toHaveText("Dashboard affilié");
    
    // Check for community link
    const communityLink = page.locator('footer a[href="/help/community"]');
    await expect(communityLink).toBeVisible();
    await expect(communityLink).toHaveText("Communauté");
  });
});
