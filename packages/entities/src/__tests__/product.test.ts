import { describe, expect, it } from "vitest";
import { createProductInputSchema } from "../product";

describe("createProductInputSchema", () => {
	it("accepts valid product input", () => {
		const result = createProductInputSchema.safeParse({
			name: "Widget",
			price: 999,
			sku: "WDG-001",
			category: "Electronics",
		});

		expect(result.success).toBe(true);
	});

	it("accepts optional description and brand", () => {
		const result = createProductInputSchema.safeParse({
			name: "Widget",
			description: "A fine widget",
			price: 999,
			sku: "WDG-001",
			category: "Electronics",
			brand: "Acme",
		});

		expect(result.success).toBe(true);
	});

	it("rejects empty name", () => {
		const result = createProductInputSchema.safeParse({
			name: "",
			price: 999,
			sku: "WDG-001",
			category: "Electronics",
		});

		expect(result.success).toBe(false);
	});

	it("rejects negative price", () => {
		const result = createProductInputSchema.safeParse({
			name: "Widget",
			price: -1,
			sku: "WDG-001",
			category: "Electronics",
		});

		expect(result.success).toBe(false);
	});

	it("rejects missing required fields", () => {
		const result = createProductInputSchema.safeParse({
			name: "Widget",
		});

		expect(result.success).toBe(false);
	});

	it("trims whitespace from string fields", () => {
		const result = createProductInputSchema.safeParse({
			name: "  Widget  ",
			price: 999,
			sku: "  WDG-001  ",
			category: "  Electronics  ",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("Widget");
			expect(result.data.sku).toBe("WDG-001");
			expect(result.data.category).toBe("Electronics");
		}
	});
});
