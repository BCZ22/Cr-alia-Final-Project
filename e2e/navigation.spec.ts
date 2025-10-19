/**
 * E2E Test: Navigation
 * Tests navigation flows and routing
 */

import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate from homepage to pricing', async ({ page }) => {
    await page.goto('/')

    // Click Pricing link
    await page.getByRole('link', { name: /Pricing/i }).click()

    // Should navigate to pricing page
    await page.waitForURL('/pricing')
    await expect(page).toHaveURL('/pricing')
    await expect(page.getByRole('heading', { name: /Des plans pour/i })).toBeVisible()
  })

  test('should navigate to community', async ({ page }) => {
    await page.goto('/')

    // Scroll to community section or use footer link
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Click community link
    const communityLink = page.getByRole('link', { name: /Communauté/i }).first()
    await communityLink.click()

    // Should navigate to community page
    await page.waitForURL('/community')
    await expect(page).toHaveURL('/community')
  })

  test('should open modals from homepage', async ({ page }) => {
    await page.goto('/')

    // Click "Commencer gratuitement" button
    const ctaButton = page.getByRole('button', { name: /Commencer gratuitement/i }).first()
    await ctaButton.click()

    // Wait for modal or redirect
    await page.waitForTimeout(1000)

    // Check if modal opened or redirected
    const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false)
    const url = page.url()
    
    expect(hasModal || url.includes('/auth')).toBeTruthy()
  })

  test('should navigate to chat support', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click chat link
    const chatLink = page.getByRole('link', { name: /Chat en direct/i }).first()
    await chatLink.click()

    // Should navigate to chat page
    await page.waitForURL('/support/chat')
    await expect(page).toHaveURL('/support/chat')
  })

  test('should navigate between pages using back button', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to pricing
    await page.getByRole('link', { name: /Pricing/i }).click()
    await page.waitForURL('/pricing')

    // Go back
    await page.goBack()
    
    // Should be on homepage
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })

  test('should handle 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/non-existent-page')
    
    // Should return 404 status
    expect(response?.status()).toBe(404)
  })

  test('should preserve scroll position on navigation', async ({ page }) => {
    await page.goto('/')

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))
    
    // Navigate to pricing
    await page.getByRole('link', { name: /Pricing/i }).click()
    await page.waitForURL('/pricing')

    // Scroll should be at top
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBe(0)
  })
})

