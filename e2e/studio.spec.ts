import { test, expect } from '@playwright/test';

test.describe('Créalia Studio Workflow', () => {
  // Use a unique project name for each test run to avoid conflicts
  const projectName = `Test Project ${Date.now()}`;
  const user = {
    email: 'test@crealia.com', // Assume this user exists in your test database
    password: 'Password123!',
  };

  // Authenticate once before running the tests in this file
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/); // Wait for login to complete
  });

  test('should allow a user to create a project, generate an image, and see the result', async ({ page }) => {
    // Navigate to the Studio or dashboard where projects are managed
    await page.goto('/dashboard');
    
    // --- 1. Create a new project ---
    // The selector will depend on your UI. This is a common pattern.
    await page.click('button:has-text("Nouveau Projet"), button:has-text("Créer un projet")');
    await page.fill('input[placeholder*="Nom du projet"]', projectName);
    await page.click('button:has-text("Créer")');
    
    // Wait for the project to appear and then click on it
    await expect(page.locator(`text=${projectName}`)).toBeVisible();
    await page.click(`text=${projectName}`);

    // --- 2. Open the Text-to-Image tool ---
    // This assumes the studio interface is now visible
    // We might need to click a button to open the studio modal first
    await page.click('button:has-text("Ouvrir le Studio")'); // This is a guess

    // Select the tool
    await page.click('text=Texte en Image'); // Or a more specific selector
    
    // --- 3. Submit a prompt ---
    const prompt = 'A beautiful sunset over the mountains, digital art';
    await page.fill('textarea[placeholder*="prompt"]', prompt);
    await page.click('button:has-text("Générer")');

    // --- 4. Wait for the result ---
    // The generation is mocked to take ~10 seconds. We should wait for the result to appear.
    // We can look for the "Résultats" section and then an image inside it.
    const resultImage = page.locator('div:has-text("Résultats") >> img');
    
    // Wait up to 30 seconds for the image to be visible
    await expect(resultImage).toBeVisible({ timeout: 30000 });
    
    // Check if the image has a valid source URL
    const imageUrl = await resultImage.getAttribute('src');
    expect(imageUrl).not.toBeNull();
    expect(imageUrl).toContain('https://');
  });
});
