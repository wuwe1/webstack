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
  expect(await response.json()).toEqual({
    error: { code: "not_found", message: "Not found" },
  })
})

test("shows an API error without retrying it", async ({ page }) => {
  let requests = 0
  await page.route("**/api/items*", (route) => {
    requests += 1
    return route.fulfill({
      status: 400,
      json: { error: { code: "invalid_request", message: "Invalid request" } },
    })
  })

  await page.goto("/")

  await expect(page.getByRole("alert")).toContainText("Invalid request")
  expect(requests).toBe(1)
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
