/**
 * E2E Test: Community
 * Tests Discord and Forum pages
 */

import { test, expect } from '@playwright/test'

test.describe('Community', () => {
  test('should load community page', async ({ page }) => {
    await page.goto('/community')

    // Check heading
    await expect(page.getByRole('heading', { name: /Rejoignez la communauté/i })).toBeVisible()
  })

  test('should display Discord card', async ({ page }) => {
    await page.goto('/community')

    // Check Discord section
    await expect(page.getByText(/Discord/i)).toBeVisible()
    await expect(page.getByText(/10,000\+ membres actifs/i)).toBeVisible()
  })

  test('should display Forum card', async ({ page }) => {
    await page.goto('/community')

    // Check Forum section
    await expect(page.getByText(/Forum/i)).toBeVisible()
    await expect(page.getByText(/Discussions détaillées/i)).toBeVisible()
  })

  test('should have Join Discord button', async ({ page }) => {
    await page.goto('/community')

    // Check button
    await expect(page.getByRole('button', { name: /Rejoindre Discord/i })).toBeVisible()
  })

  test('should have View Forum button', async ({ page }) => {
    await page.goto('/community')

    // Check button
    await expect(page.getByRole('button', { name: /Voir le forum/i })).toBeVisible()
  })

  test('should navigate to forum', async ({ page }) => {
    await page.goto('/community')

    // Click forum button
    await page.getByRole('button', { name: /Voir le forum/i }).click()

    // Should navigate to /community/forum
    await page.waitForURL('/community/forum')
    await expect(page).toHaveURL('/community/forum')
  })

  test('should load forum page', async ({ page }) => {
    await page.goto('/community/forum')

    // Check heading
    await expect(page.getByRole('heading', { name: /Forum Créalia/i })).toBeVisible()
  })

  test('should display create topic button', async ({ page }) => {
    await page.goto('/community/forum')

    // Check button
    await expect(page.getByRole('button', { name: /Nouveau topic/i })).toBeVisible()
  })

  test('should display categories', async ({ page }) => {
    await page.goto('/community')

    // Check categories
    await expect(page.getByText(/Général/i)).toBeVisible()
    await expect(page.getByText(/Reels & Shorts/i)).toBeVisible()
  })
})

