import { expect, test } from "@playwright/test"

test("lists items from the API", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("cell", { name: "Keyboard" })).toBeVisible()
})

test("shows a page for unknown addresses", async ({ page }) => {
  await page.goto("/missing")

  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible()

  await page.getByRole("link", { name: "Back to home" }).click()
  await expect(page.getByRole("cell", { name: "Keyboard" })).toBeVisible()
})

test("answers unknown API paths with JSON", async ({ request }) => {
  const response = await request.get("/api/missing")

  expect(response.status()).toBe(404)
  expect(await response.json()).toEqual({ error: "Not found" })
})

test("fits a phone-width screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 })
  await page.goto("/")
  await expect(page.getByRole("cell", { name: "Keyboard" })).toBeVisible()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )
  expect(overflow).toBe(false)
})
