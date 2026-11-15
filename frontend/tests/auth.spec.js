
import { test, expect } from "@playwright/test";

test("User can register and login successfully", async ({ page }) => {

    // Generate unique test credentials
    const uniqueEmail = `folio${Date.now()}@example.com`;
    const password = "TestPassword123";

    // Step 1: Open Folio
    await page.goto("/");

    // Step 2: Navigate to registration
    await page.getByRole("button", {
        name: "Create account",
        exact: true
    }).click();

    // Step 3: Fill registration form
    await page.getByLabel("Username").fill("Folio Test User");
    await page.getByLabel("Email address").fill(uniqueEmail);

    await page.getByRole("textbox", {
        name: "Password",
        exact: true
    }).fill(password);

    await page.getByRole("textbox", {
        name: "Confirm password",
        exact: true
    }).fill(password);

    // Step 4: Submit registration
    await page.getByRole("button", {
        name: "Create account",
        exact: true
    }).click();

    // Step 5: Verify registration success
    await expect(page.getByRole("status")).toHaveText(
        "Account created successfully! Please sign in."
    );

    // Step 6: Navigate to login
    await page.getByRole("button", {
        name: "Go to Login"
    }).click();

    // Step 7: Enter login credentials
    await page.getByLabel("Email address").fill(uniqueEmail);

    await page.getByRole("textbox", {
        name: "Password",
        exact: true
    }).fill(password);

    // Step 8: Submit login
    await page.getByRole("button", {
        name: "Sign in"
    }).click();

    // Step 9: Verify authenticated application opens
    await expect(page.locator("main")).toBeVisible();

});


test("Registration should reject mismatched passwords", async ({ page }) => {

    // Declare test credentials locally
    const password = "Password123";

    // Step 1: Open Folio
    await page.goto("/");

    // Step 2: Navigate to registration
    await page.getByRole("button", {
        name: "Create account",
        exact: true
    }).click();

    // Step 3: Fill registration details
    await page.getByLabel("Username").fill("Mismatch Test");

    await page.getByLabel("Email address").fill(
        `mismatch${Date.now()}@example.com`
    );

    await page.getByRole("textbox", {
        name: "Password",
        exact: true
    }).fill(password);

    await page.getByRole("textbox", {
        name: "Confirm password",
        exact: true
    }).fill("DifferentPassword123");

    // Step 4: Submit form
    await page.getByRole("button", {
        name: "Create account",
        exact: true
    }).click();

    // Step 5: Verify client-side validation
    await expect(page.getByRole("alert")).toHaveText(
        "Passwords do not match."
    );

});
