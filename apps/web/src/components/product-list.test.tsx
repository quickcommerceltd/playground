import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProductList } from "./product-list";

vi.mock("@zapp/utils", () => ({
	formatCurrency: (cents: number) => `$${(cents / 100).toFixed(2)}`,
}));

const mockProduct = {
	id: 1,
	name: "Test Widget",
	description: "A test product",
	price: 999,
	sku: "TST-001",
	category: "Test",
	brand: "TestBrand",
	rating: 4.5,
	review_count: 10,
	in_stock: 1,
	stock_quantity: 5,
	discount_percent: 0,
};

describe("ProductList", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("renders empty state when there are no products", () => {
		render(<ProductList products={[]} />);
		expect(screen.getByText("No products found.")).toBeDefined();
	});

	it("renders products when provided via props", () => {
		render(<ProductList products={[mockProduct]} />);
		expect(screen.getByText("Test Widget")).toBeDefined();
		expect(screen.getByText("$9.99")).toBeDefined();
		expect(screen.getByText("In Stock")).toBeDefined();
		const productLink = screen.getByRole("link", { name: /test widget/i });
		expect(productLink.getAttribute("href")).toBe("/products/1");
	});

	it("displays 'Out of Stock' when in_stock is 0", () => {
		const outOfStockProduct = {
			...mockProduct,
			in_stock: 0,
			stock_quantity: 0,
		};
		render(<ProductList products={[outOfStockProduct]} />);
		expect(screen.getByText("Out of Stock")).toBeDefined();
	});
});
