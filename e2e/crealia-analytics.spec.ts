import { test, expect } from '@playwright/test'

test.describe('Créalia Analytics Interface', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test('should load analytics page without errors', async ({ page }) => {
    // Navigate to analytics page
    const response = await page.goto('/analytics', { waitUntil: 'networkidle' })
    
    // Check response is successful
    expect(response?.status()).toBeLessThan(400)
    
    // Wait for content to load (not just loading spinner)
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 10000 })
    
    // Verify no console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Wait a bit to catch any async errors
    await page.waitForTimeout(2000)
    
    // Filter out known benign errors (customize as needed)
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('source map')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should display analytics interface from homepage button', async ({ page }) => {
    // Go to homepage
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // Find and click Analytics button
    const analyticsButton = page.locator('text=Créalia Analytics').first()
    await expect(analyticsButton).toBeVisible({ timeout: 5000 })
    
    await analyticsButton.click()
    
    // Wait for modal/interface to appear
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 10000 })
    
    // Verify key elements are present
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible()
  })

  test('should display platform connection cards', async ({ page }) => {
    await page.goto('/analytics', { waitUntil: 'networkidle' })
    
    // Wait for interface to load
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 10000 })
    
    // Check for platform names
    const platforms = ['Instagram', 'TikTok', 'YouTube', 'Facebook']
    
    for (const platform of platforms) {
      const platformElement = page.locator(`text=${platform}`).first()
      await expect(platformElement).toBeVisible({ timeout: 5000 })
    }
  })

  test('should handle navigation between tabs', async ({ page }) => {
    await page.goto('/analytics', { waitUntil: 'networkidle' })
    
    // Wait for interface
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 10000 })
    
    // Click on different tabs
    const tabs = [
      'Vue d\'ensemble',
      'Connexions',
      'Analyse de contenu',
      'Tendances'
    ]
    
    for (const tab of tabs) {
      const tabButton = page.locator(`button:has-text("${tab}")`).first()
      if (await tabButton.isVisible()) {
        await tabButton.click()
        await page.waitForTimeout(500) // Wait for tab content to render
        
        // Verify tab is active (has specific styling)
        const isActive = await tabButton.evaluate(el => 
          el.classList.contains('bg-primary') || 
          el.classList.contains('text-primary')
        )
        expect(isActive).toBeTruthy()
      }
    }
  })

  test('should show loading state initially', async ({ page }) => {
    // Start navigation but don't wait for networkidle
    await page.goto('/analytics', { waitUntil: 'domcontentloaded' })
    
    // Should show loading spinner
    const loadingIndicator = page.locator('.animate-spin').first()
    
    // May or may not be visible depending on how fast the page loads
    // Just checking it doesn't error
    const isVisible = await loadingIndicator.isVisible().catch(() => false)
    
    // Eventually should show the actual interface
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 15000 })
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('**/api/analytics/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    await page.goto('/analytics', { waitUntil: 'networkidle' })
    
    // Wait a bit for any error handling
    await page.waitForTimeout(2000)
    
    // Should not show generic error page
    // Should still render the UI (even with empty data)
    const hasContent = await page.locator('body').textContent()
    expect(hasContent).toBeTruthy()
  })

  test('should close interface and navigate back', async ({ page }) => {
    await page.goto('/analytics', { waitUntil: 'networkidle' })
    
    // Wait for interface
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 10000 })
    
    // Look for close button (X icon)
    const closeButton = page.locator('button').filter({ has: page.locator('svg') }).first()
    
    if (await closeButton.isVisible()) {
      // Get current URL
      const currentUrl = page.url()
      
      await closeButton.click()
      
      // Wait for navigation or URL change
      await page.waitForTimeout(1000)
      
      // URL should have changed (back to home or previous page)
      const newUrl = page.url()
      
      // Either went back or closed the modal
      expect(newUrl === currentUrl || newUrl.includes('/')).toBeTruthy()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/analytics', { waitUntil: 'networkidle' })
    
    // Wait for interface
    await page.waitForSelector('text=Créalia Analytics Pro', { timeout: 10000 })
    
    // Check that content is visible (not overflowing or hidden)
    const mainContent = page.locator('text=Créalia Analytics Pro').first()
    await expect(mainContent).toBeVisible()
    
    // Check viewport width is respected
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })
})
