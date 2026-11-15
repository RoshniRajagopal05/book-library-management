
import { test, expect } from "@playwright/test";

test("User can add a book and view it in the library", async ({ page }) => {
    const email = `booktest${Date.now()}@example.com`;
    const password = "TestPassword123";
    const bookTitle = "The Alchemist";
    const bookAuthor = "Paulo Coelho";

    // 1. Open Folio
    await page.goto("/");

    // 2. Open registration
    await page.getByRole("button", {
        name: "Create account",
        exact: true
    }).click();

    // 3. Register user
    await page.getByLabel("Username").fill("Book Test User");
    await page.getByLabel("Email address").fill(email);

    await page.getByRole("textbox", {
        name: "Password",
        exact: true
    }).fill(password);

    await page.getByRole("textbox", {
        name: "Confirm password",
        exact: true
    }).fill(password);

    await page.getByRole("button", {
        name: "Create account",
        exact: true
    }).click();

    // 4. Navigate to login
    await expect(page.getByRole("status")).toBeVisible();

    await page.getByRole("button", {
        name: "Go to Login"
    }).click();

    // 5. Login
    await page.getByLabel("Email address").fill(email);

    await page.getByRole("textbox", {
        name: "Password",
        exact: true
    }).fill(password);

    await page.getByRole("button", {
        name: "Sign in",
        exact: true
    }).click();

    // 6. Wait for dashboard
    await expect(
        page.getByRole("heading", {
            name: /welcome back/i
        })
    ).toBeVisible();

    // 7. Navigate to Add a Book
    await page.getByRole("button", {
        name: "Add a Book",
        exact: true
    }).click();

    // 8. Fill book details
    await page.getByLabel("Book Title").fill(bookTitle);
    await page.getByLabel("Author").fill(bookAuthor);

    await page.getByLabel("Reading Status").selectOption("Want to Read");

    // 9. Submit book form
    await page.locator("form").getByRole("button", {
        name: "Add Book",
        exact: true
    }).click();

    // 10. Verify successful creation
    await expect(
        page.getByText("Book added successfully!")
    ).toBeVisible({ timeout: 15000 });

    // 11. Navigate to My Library
    await page.getByRole("button", {
        name: "My Library",
        exact: true
    }).click();

    // 12. Verify book details
    await expect(
        page.getByText(bookTitle, { exact: true })
    ).toBeVisible();

    await expect(
        page.getByText(`By ${bookAuthor}`, { exact: true })
    ).toBeVisible();
});
