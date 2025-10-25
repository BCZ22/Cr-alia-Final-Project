import { test, expect } from '@playwright/test';

test.describe('Créalia AI Interface', () => {

  test.beforeEach(async ({ page }) => {
    // Mock a logged-in state. This is crucial for accessing protected routes.
    // Replace with your actual login flow or a session-based login helper.
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test-user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/studio');
  });

  test('should open AI chat, send a prompt, and receive a response', async ({ page }) => {
    // 1. Navigate to the page with the AI chat interface
    await page.goto('/crealia-ai'); // Assuming this is the correct URL for the chat

    // 2. Wait for the chat input to be visible and type a prompt
    const chatInput = page.locator('textarea[placeholder="Type your prompt here..."]');
    await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    await chatInput.fill('Generate a short story about a robot exploring a forest.');

    // 3. Click the send button
    await page.click('button:has-text("Send")');

    // 4. Assert that a loading indicator appears.
    await expect(page.locator('[data-testid="ai-thinking-indicator"]')).toBeVisible();

    // 5. Wait for the response to appear. The timeout here is important as AI responses can be slow.
    const aiResponse = page.locator('.ai-message'); // Use a more specific selector if possible
    await aiResponse.waitFor({ state: 'visible', timeout: 15000 });
    
    // 6. Assert that the response contains an ID and some text.
    // This assumes the response has a structure we can inspect.
    const responseText = await aiResponse.innerText();
    expect(responseText).toContain('ID:'); // Or some unique identifier pattern
    expect(responseText.length).toBeGreaterThan(50); // Check that it's not an empty response
    
    // 7. Assert that the loading indicator is gone.
    await expect(page.locator('[data-testid="ai-thinking-indicator"]')).not.toBeVisible();
  });

});
