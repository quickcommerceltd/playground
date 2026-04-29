import { expect, test } from "@playwright/test";

test("product detail page loads from list", async ({ page }) => {
	await page.goto("/products");
	const firstProductLink = page.locator('a[href^="/products/"]').first();
	await firstProductLink.waitFor();
	await firstProductLink.click();
	await expect(page).toHaveURL(/\/products\/\d+/);
	await expect(page.getByRole("link", { name: "Back to products" })).toBeVisible();
});
