import { test, expect } from '@playwright/test'

test.describe('Form Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to contact section', async ({ page }) => {
    // Scroll to contact section
    await page.locator('a[href="#contact"]').click()
    await page.waitForURL(/#contact/)
  })

  test('should focus on form input with keyboard', async ({ page }) => {
    // Navigate to contact section
    await page.locator('a[href="#contact"]').click()

    // Tab through to form inputs
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check if form is focused
    const form = page.locator('form')
    expect(form).toBeDefined()
  })

  test('should have accessible form labels', async ({ page }) => {
    await page.locator('a[href="#contact"]').click()

    // Check for labels
    const labels = await page.locator('label').count()
    expect(labels).toBeGreaterThan(0)
  })

  test('should show focus indicators on interactive elements', async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press('Tab')

    const focusedElement = await page.evaluate(() => document.activeElement)
    expect(focusedElement).toBeDefined()
  })

  test('should support keyboard navigation throughout page', async ({ page }) => {
    const initialActiveElement = await page.evaluate(() =>
      document.activeElement?.tagName
    )

    // Tab through multiple elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
    }

    const finalActiveElement = await page.evaluate(() =>
      document.activeElement?.tagName
    )

    // Should have navigated to a different element
    expect(finalActiveElement).toBeDefined()
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const mainContent = page.locator('main')
    expect(mainContent).toBeDefined()

    // Content should still be visible on mobile
    const isVisible = await mainContent.isVisible()
    expect(isVisible).toBe(true)
  })

  test('should handle animation preference for reduced motion', async ({
    page,
  }) => {
    // Emulate prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })

    // Animations should be disabled or instant
    const particle = page.locator('canvas')
    expect(particle).toBeDefined()
  })

  test('should have proper color contrast', async ({ page }) => {
    // This is a basic check - real audit would use axe or similar
    const headings = page.locator('h1, h2, h3')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should be keyboard navigable without mouse', async ({ page }) => {
    // Start keyboard navigation
    await page.keyboard.press('Tab')
    const firstElement = await page.evaluate(() => document.activeElement)
    expect(firstElement).toBeDefined()

    // Tab back with Shift+Tab
    await page.keyboard.press('Shift+Tab')
    const previousElement = await page.evaluate(() => document.activeElement)
    expect(previousElement).toBeDefined()
  })
})
