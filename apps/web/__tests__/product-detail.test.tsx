import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductDetail } from "../src/components/product-detail";

const fixture = {
	id: 1,
	name: "Test Widget",
	description: "A really nice widget for testing.",
	price: 1999,
	sku: "TW-001",
	category: "Widgets",
	brand: "Acme",
	rating: 4.5,
	review_count: 12,
	in_stock: 1,
	stock_quantity: 5,
	discount_percent: 10,
};

describe("ProductDetail", () => {
	it("renders product name, price, sku, and back link", () => {
		render(<ProductDetail product={fixture} />);
		expect(screen.getByText("Test Widget")).toBeDefined();
		expect(screen.getByText("$19.99")).toBeDefined();
		expect(screen.getByText(/TW-001/)).toBeDefined();
		const backLink = screen.getByRole("link", { name: /back to products/i });
		expect(backLink).toBeDefined();
		expect(backLink.getAttribute("href")).toBe("/products");
	});
});
