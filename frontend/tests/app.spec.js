
import { test, expect } from "@playwright/test";

test("Folio application should open successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).toBeVisible();
});
