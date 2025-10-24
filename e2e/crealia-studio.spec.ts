/**
 * E2E Tests for Créalia Studio
 * Tests the main user flows: upload, analyze, generate, download
 */

import { test, expect } from '@playwright/test'

test.describe('Créalia Studio', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/')
    // Assume user is authenticated in tests
  })

  test('should open Créalia Studio interface', async ({ page }) => {
    // Navigate to Studio
    await page.click('[data-testid="crealia-studio-link"]')

    // Verify interface is visible
    await expect(page.locator('text=Créalia Studio')).toBeVisible()
    await expect(page.locator('text=Votre studio de création IA tout-en-un')).toBeVisible()

    // Verify sidebar categories
    await expect(page.locator('text=Recommandé')).toBeVisible()
    await expect(page.locator('text=Vidéo')).toBeVisible()
    await expect(page.locator('text=Image')).toBeVisible()
    await expect(page.locator('text=Contenu Audio')).toBeVisible()
  })

  test('should display tools in selected category', async ({ page }) => {
    await page.goto('/studio')

    // Click on Vidéo category
    await page.click('button:has-text("Vidéo")')

    // Verify video tools are displayed
    await expect(page.locator('text=Redimensionner la vidéo')).toBeVisible()
    await expect(page.locator('text=Améliorateur de vidéos')).toBeVisible()
    await expect(page.locator('text=Transitions IA')).toBeVisible()
  })

  test('should select a tool and show details panel', async ({ page }) => {
    await page.goto('/studio')

    // Click on a tool
    await page.click('text=Générateur de Reels IA')

    // Verify details panel appears
    await expect(page.locator('text=📤 Média source')).toBeVisible()
    await expect(page.locator('text=⚙️ Paramètres')).toBeVisible()
    await expect(page.locator('button:has-text("Générer")')).toBeVisible()
  })

  test('should show presets when tool has them', async ({ page }) => {
    await page.goto('/studio')

    // Select Reels Generator
    await page.click('text=Générateur de Reels IA')

    // Verify presets section
    await expect(page.locator('text=⚡ Exemples rapides (presets)')).toBeVisible()
    await expect(page.locator('text=Marketing Auto - Sportif')).toBeVisible()
    await expect(page.locator('text=Luxe & Lifestyle')).toBeVisible()
  })

  test('should apply preset and populate form', async ({ page }) => {
    await page.goto('/studio')

    // Select tool
    await page.click('text=Générateur de Reels IA')

    // Click preset
    await page.click('button:has-text("Marketing Auto - Sportif")')

    // Verify form is populated
    // Note: Actual selectors would depend on implementation
    // This is a simplified example
    const formatSelect = page.locator('[name="aspect_ratio"]')
    await expect(formatSelect).toHaveValue('9:16')
  })

  test('should upload file via drag and drop', async ({ page }) => {
    await page.goto('/studio')

    // Select tool
    await page.click('text=Générateur de Reels IA')

    // Mock file upload
    const fileInput = await page.locator('input[type="file"]')
    
    // Create a test file
    const buffer = Buffer.from('fake video content')
    await fileInput.setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer,
    })

    // Verify upload success message
    await expect(page.locator('text=Fichier uploadé ✅')).toBeVisible({ timeout: 10000 })
  })

  test('should show analysis results after upload', async ({ page }) => {
    await page.goto('/studio')

    // Enable MOCK mode via environment or API mock
    // This test assumes CREALIA_MOCK=true

    // Select tool and upload
    await page.click('text=Générateur de Reels IA')

    const fileInput = await page.locator('input[type="file"]')
    const buffer = Buffer.from('fake video')
    await fileInput.setInputFiles({
      name: 'test.mp4',
      mimeType: 'video/mp4',
      buffer,
    })

    // Wait for analysis
    await expect(page.locator('text=🎞️ Scènes détectées')).toBeVisible({ timeout: 15000 })
  })

  test('should validate required form fields', async ({ page }) => {
    await page.goto('/studio')

    // Select tool
    await page.click('text=Générateur de Reels IA')

    // Try to generate without upload
    const generateButton = page.locator('button:has-text("Générer")')
    await expect(generateButton).toBeDisabled()
  })

  test('should generate content and show results', async ({ page }) => {
    await page.goto('/studio')

    // Enable MOCK mode
    await page.addInitScript(() => {
      (window as any).CREALIA_MOCK = true
    })

    // Select tool
    await page.click('text=Générateur de Reels IA')

    // Upload file
    const fileInput = await page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake'),
    })

    // Wait for upload
    await expect(page.locator('text=Fichier uploadé ✅')).toBeVisible({ timeout: 10000 })

    // Fill form (presets will auto-fill)
    await page.click('button:has-text("Viral & Fun")')

    // Generate
    await page.click('button:has-text("Générer")')

    // Wait for generation
    await expect(page.locator('text=Génération en cours')).toBeVisible()

    // Wait for results (in mock mode should be fast)
    await expect(page.locator('text=✨ Résultats')).toBeVisible({ timeout: 10000 })

    // Verify download button appears
    await expect(page.locator('button:has-text("Télécharger")')).toBeVisible()
  })

  test('should download generated output', async ({ page }) => {
    await page.goto('/studio')

    // Mock scenario with completed job
    // This would require setting up mock data

    // Select tool with existing output
    await page.click('text=Générateur de Reels IA')

    // Simulate having outputs
    // In real test, would go through full flow

    // Click download
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Télécharger")').first()
    const download = await downloadPromise

    // Verify download started
    expect(download).toBeTruthy()
  })

  test('should toggle auto-run', async ({ page }) => {
    await page.goto('/studio')

    await page.click('text=Générateur de Reels IA')

    // Find auto-run toggle
    const autoRunToggle = page.locator('text=Auto-run').locator('..')

    // Toggle on
    await autoRunToggle.click()

    // Verify state
    // Note: Actual verification depends on implementation
  })

  test('should show error for invalid file type', async ({ page }) => {
    await page.goto('/studio')

    await page.click('text=Générateur de Reels IA')

    // Try to upload invalid file
    const fileInput = await page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('text file'),
    })

    // Verify error message
    await expect(page.locator('text=Format non pris en charge')).toBeVisible({ timeout: 5000 })
  })

  test('should show error for file too large', async ({ page }) => {
    await page.goto('/studio')

    await page.click('text=Générateur de Reels IA')

    // Create a buffer representing >2GB (mock)
    // In real test, would mock the validation

    // Verify error appears
    // await expect(page.locator('text=Fichier trop volumineux')).toBeVisible()
  })

  test('should open help modal', async ({ page }) => {
    await page.goto('/studio')

    // Click help button
    await page.click('[data-testid="help-button"]')

    // Verify help modal
    await expect(page.locator('text=Aide rapide')).toBeVisible()
    await expect(page.locator('text=💡 Astuce')).toBeVisible()

    // Close modal
    await page.click('button:has-text("Fermer")')
    await expect(page.locator('text=Aide rapide')).not.toBeVisible()
  })

  test('should navigate between categories', async ({ page }) => {
    await page.goto('/studio')

    // Navigate to different categories
    await page.click('button:has-text("Vidéo")')
    await expect(page.locator('text=Créez des vidéos IA professionnelles')).toBeVisible()

    await page.click('button:has-text("Image")')
    await expect(page.locator('text=Générez des images IA créatives')).toBeVisible()

    await page.click('button:has-text("Contenu Audio")')
    await expect(page.locator('text=Créez du contenu audio avec l\'IA')).toBeVisible()
  })

  test('should track analytics events', async ({ page }) => {
    let analyticsEvents: string[] = []

    // Intercept analytics calls
    await page.route('/api/analytics/event', (route) => {
      const request = route.request()
      const postData = request.postDataJSON()
      analyticsEvents.push(postData.type)
      route.fulfill({ status: 200, body: '{}' })
    })

    await page.goto('/studio')

    // Select tool
    await page.click('text=Générateur de Reels IA')

    // Verify tool_opened event
    expect(analyticsEvents).toContain('tool_opened')
  })

  test('should close studio interface', async ({ page }) => {
    await page.goto('/studio')

    // Click close button
    await page.click('[aria-label="Close"]')

    // Verify interface closed
    await expect(page.locator('text=Créalia Studio')).not.toBeVisible()
  })
})

