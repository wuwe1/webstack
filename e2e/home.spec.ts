import { expect, test } from "@playwright/test";

test("lists items from the API", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("cell", { name: "Keyboard" })).toBeVisible();
});

test("fits a phone-width screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/");
  await expect(page.getByRole("cell", { name: "Keyboard" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
