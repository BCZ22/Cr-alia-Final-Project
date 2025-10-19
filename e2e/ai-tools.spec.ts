/**
 * E2E Test: AI Tools
 * Tests Reels generator and Image generator
 */

import { test, expect } from '@playwright/test'

test.describe('AI Tools', () => {
  test.describe('Reels Generator', () => {
    test('should load reels page', async ({ page }) => {
      await page.goto('/reels')

      // Check heading
      await expect(page.getByRole('heading', { name: /Créez des Reels viraux/i })).toBeVisible()
    })

    test('should have prompt input', async ({ page }) => {
      await page.goto('/reels')

      // Check textarea
      const textarea = page.getByPlaceholder(/Décrivez votre Reel/i)
      await expect(textarea).toBeVisible()
    })

    test('should have generate button', async ({ page }) => {
      await page.goto('/reels')

      // Check button
      await expect(page.getByRole('button', { name: /Générer mon Reel/i })).toBeVisible()
    })

    test('should disable button when empty', async ({ page }) => {
      await page.goto('/reels')

      // Button should be disabled
      const button = page.getByRole('button', { name: /Générer mon Reel/i })
      await expect(button).toBeDisabled()
    })

    test('should enable button when prompt filled', async ({ page }) => {
      await page.goto('/reels')

      // Fill prompt
      const textarea = page.getByPlaceholder(/Décrivez votre Reel/i)
      await textarea.fill('Un Reel sur les 5 meilleurs conseils pour Instagram')

      // Button should be enabled (or redirect to auth if not logged in)
      const button = page.getByRole('button', { name: /Générer mon Reel/i })
      await expect(button).not.toBeDisabled()
    })
  })

  test.describe('Image Generator', () => {
    test('should load images page', async ({ page }) => {
      await page.goto('/images')

      // Check heading
      await expect(page.getByRole('heading', { name: /Créez des images uniques/i })).toBeVisible()
    })

    test('should have prompt input', async ({ page }) => {
      await page.goto('/images')

      // Check textarea
      const textarea = page.getByPlaceholder(/Décrivez votre image/i)
      await expect(textarea).toBeVisible()
    })

    test('should have generate button', async ({ page }) => {
      await page.goto('/images')

      // Check button
      await expect(page.getByRole('button', { name: /Générer l'image/i })).toBeVisible()
    })

    test('should disable button when empty', async ({ page }) => {
      await page.goto('/images')

      // Button should be disabled
      const button = page.getByRole('button', { name: /Générer l'image/i })
      await expect(button).toBeDisabled()
    })

    test('should enable button when prompt filled', async ({ page }) => {
      await page.goto('/images')

      // Fill prompt
      const textarea = page.getByPlaceholder(/Décrivez votre image/i)
      await textarea.fill('Un studio moderne avec néons violets')

      // Button should be enabled
      const button = page.getByRole('button', { name: /Générer l'image/i })
      await expect(button).not.toBeDisabled()
    })
  })
})

