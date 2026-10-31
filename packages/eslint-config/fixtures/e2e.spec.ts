import { expect, test } from "@playwright/test"

test.only("is focused", async ({ page }) => { // expect: no-only-tests/no-only-tests
  await expect(page).toHaveURL("/")
})
