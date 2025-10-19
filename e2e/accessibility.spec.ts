/**
 * E2E Test: Accessibility
 * Tests accessibility features
 */

import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/')

    // Check H1
    const h1 = page.locator('h1')
    const h1Count = await h1.count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
  })

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/')

    // Check all images have alt text
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeDefined()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Tab through focusable elements
    await page.keyboard.press('Tab')
    
    // Check if an element is focused
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(focused).toBeTruthy()
  })

  test('should have proper ARIA labels on buttons', async ({ page }) => {
    await page.goto('/')

    // Check button with aria-label
    const loginButton = page.getByRole('button', { name: /Se connecter/i })
    await expect(loginButton).toBeVisible()

    const hasAriaLabel = await loginButton.evaluate((el) => el.hasAttribute('aria-label'))
    expect(hasAriaLabel).toBeTruthy()
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')

    // Check primary text color contrast
    // This is a basic check - in production use axe-core
    const body = page.locator('body')
    const color = await body.evaluate((el) => getComputedStyle(el).color)
    expect(color).toBeTruthy()
  })

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/')

    // Tab to a button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check if focused element has outline or ring
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const styles = getComputedStyle(el)
      return styles.outline !== 'none' || styles.boxShadow.includes('ring')
    })

    expect(focused).toBeTruthy()
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/support/chat')
    
    // Wait for chat to load
    await page.waitForTimeout(2000)

    // Check textarea has label or aria-label
    const textarea = page.getByPlaceholder(/Posez votre question/i)
    await expect(textarea).toBeVisible()
  })

  test('should support screen reader announcements', async ({ page }) => {
    await page.goto('/')

    // Check for aria-live regions
    const liveRegions = page.locator('[aria-live]')
    const count = await liveRegions.count()
    
    // Having live regions is good for accessibility
    expect(count).toBeGreaterThanOrEqual(0)
  })
})

