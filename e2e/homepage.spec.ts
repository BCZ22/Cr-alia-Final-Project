/**
 * E2E Test: Homepage
 * Tests homepage loads and displays content
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/Créalia/)

    // Check main heading
    const heading = page.getByRole('heading', { name: /Créez du contenu viral/i })
    await expect(heading).toBeVisible()
  })

  test('should display navigation', async ({ page }) => {
    await page.goto('/')

    // Check nav links
    await expect(page.getByRole('link', { name: /Créalia AI/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Créalia Studio/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Créalia Analytics/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Inspiration/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /FAQ/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Pricing/i })).toBeVisible()
  })

  test('should display CTA buttons', async ({ page }) => {
    await page.goto('/')

    // Check CTA buttons
    await expect(page.getByRole('button', { name: /Commencer gratuitement/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Se connecter/i })).toBeVisible()
  })

  test('should display stats', async ({ page }) => {
    await page.goto('/')

    // Check stats section
    await expect(page.getByText(/10K\+/)).toBeVisible()
    await expect(page.getByText(/Créateurs actifs/)).toBeVisible()
  })

  test('should display footer', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check footer content
    await expect(page.getByText(/© 2024 Créalia/)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check mobile menu button (if exists)
    const heading = page.getByRole('heading', { name: /Créez du contenu viral/i })
    await expect(heading).toBeVisible()
  })
})

