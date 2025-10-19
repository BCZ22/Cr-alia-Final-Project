/**
 * E2E Test: Pricing Page
 * Tests pricing page and subscription flow
 */

import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing')

    // Check heading
    await expect(page.getByRole('heading', { name: /Des plans pour/i })).toBeVisible()
  })

  test('should display pricing plans', async ({ page }) => {
    await page.goto('/pricing')

    // Check plan names
    await expect(page.getByText(/Créateur/i)).toBeVisible()
    await expect(page.getByText(/Viral/i)).toBeVisible()
    await expect(page.getByText(/Pro/i)).toBeVisible()
  })

  test('should display monthly prices', async ({ page }) => {
    await page.goto('/pricing')

    // Check monthly prices
    await expect(page.getByText(/\$19/)).toBeVisible()
    await expect(page.getByText(/\$39/)).toBeVisible()
    await expect(page.getByText(/\$79/)).toBeVisible()
  })

  test('should toggle between monthly and yearly', async ({ page }) => {
    await page.goto('/pricing')

    // Click yearly toggle
    await page.getByRole('button', { name: /Annuel/i }).click()

    // Check yearly prices
    await expect(page.getByText(/\$13/)).toBeVisible()
    await expect(page.getByText(/\$27/)).toBeVisible()
    await expect(page.getByText(/\$55/)).toBeVisible()

    // Click monthly toggle
    await page.getByRole('button', { name: /Mensuel/i }).click()

    // Check monthly prices again
    await expect(page.getByText(/\$19/)).toBeVisible()
  })

  test('should display plan features', async ({ page }) => {
    await page.goto('/pricing')

    // Check features
    await expect(page.getByText(/Analytics/i)).toBeVisible()
    await expect(page.getByText(/Support/i)).toBeVisible()
  })

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/pricing')

    // Check Commencer buttons
    const buttons = page.getByRole('button', { name: /Commencer/i })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(3) // At least 3 plans
  })

  test('should redirect to auth if not logged in', async ({ page }) => {
    await page.goto('/pricing')

    // Click on first Commencer button
    const firstButton = page.getByRole('button', { name: /Commencer/i }).first()
    await firstButton.click()

    // Should redirect to signin (or show modal)
    // Wait for navigation or modal
    await page.waitForTimeout(1000)

    // Check if redirected or modal shown
    const url = page.url()
    const hasModal = await page.getByText(/Se connecter/i).isVisible()
    
    expect(url.includes('/auth/signin') || hasModal).toBeTruthy()
  })
})

