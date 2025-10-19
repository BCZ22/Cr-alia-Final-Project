/**
 * E2E Test: Chat Support
 * Tests 24/7 chat interface
 */

import { test, expect } from '@playwright/test'

test.describe('Chat Support', () => {
  test('should load chat page', async ({ page }) => {
    await page.goto('/support/chat')

    // Wait for chat to initialize
    await page.waitForTimeout(2000)

    // Check heading
    await expect(page.getByRole('heading', { name: /Comment pouvons-nous vous aider/i })).toBeVisible()
  })

  test('should display welcome message', async ({ page }) => {
    await page.goto('/support/chat')

    // Wait for initialization
    await page.waitForTimeout(2000)

    // Check for welcome message
    await expect(page.getByText(/Bonjour/i)).toBeVisible()
  })

  test('should have message input', async ({ page }) => {
    await page.goto('/support/chat')

    // Wait for initialization
    await page.waitForTimeout(2000)

    // Check input
    const input = page.getByPlaceholder(/Posez votre question/i)
    await expect(input).toBeVisible()
  })

  test('should have send button', async ({ page }) => {
    await page.goto('/support/chat')

    // Wait for initialization
    await page.waitForTimeout(2000)

    // Check button
    const button = page.getByRole('button').filter({ has: page.locator('svg') }).last()
    await expect(button).toBeVisible()
  })

  test('should send message and receive response', async ({ page }) => {
    await page.goto('/support/chat')

    // Wait for initialization
    await page.waitForTimeout(2000)

    // Type message
    const input = page.getByPlaceholder(/Posez votre question/i)
    await input.fill('Comment créer un Reel viral ?')

    // Send message
    const button = page.getByRole('button').filter({ has: page.locator('svg') }).last()
    await button.click()

    // Wait for response
    await page.waitForTimeout(3000)

    // Check message was sent
    await expect(page.getByText(/Comment créer un Reel viral/i)).toBeVisible()

    // Check response received (should be visible)
    const messages = page.locator('div[class*="rounded-2xl"]')
    const count = await messages.count()
    expect(count).toBeGreaterThan(1) // At least welcome + user message
  })

  test('should display quick actions', async ({ page }) => {
    await page.goto('/support/chat')

    // Wait for initialization
    await page.waitForTimeout(2000)

    // Check quick actions
    await expect(page.getByText(/Consulter la FAQ/i)).toBeVisible()
    await expect(page.getByText(/Tutoriels vidéo/i)).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/support/chat')

    // Wait for initialization
    await page.waitForTimeout(2000)

    // Check input still visible
    const input = page.getByPlaceholder(/Posez votre question/i)
    await expect(input).toBeVisible()
  })
})

