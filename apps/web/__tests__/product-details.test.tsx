import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductDetails from "../src/components/product-details";

vi.mock("@/lib/utils", () => ({
	API_URL: "http://localhost:4992",
	cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

vi.mock("@zapp/utils", () => ({
	formatCurrency: (amount: number) => `$${(amount / 100).toFixed(2)}`,
}));

const mockProduct = {
	id: 1,
	name: "Test Product",
	description: "A test description",
	price: 1999,
	sku: "TEST-001",
	category: "Electronics",
	brand: "TestBrand",
	rating: 4.5,
	review_count: 123,
	in_stock: 1,
	stock_quantity: 42,
	discount_percent: 10,
};

describe("ProductDetails", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("shows loading state initially", () => {
		vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));

		render(<ProductDetails id="1" />);

		expect(screen.getByText("Loading...")).toBeDefined();
	});

	it("renders product details on successful fetch", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockProduct),
				})
			)
		);

		render(<ProductDetails id="1" />);

		await waitFor(() => {
			expect(screen.getByText("Test Product")).toBeDefined();
		});

		expect(screen.getByText("TestBrand · Electronics")).toBeDefined();
		expect(screen.getByText("A test description")).toBeDefined();
		expect(screen.getByText("$19.99")).toBeDefined();
		expect(screen.getByText("-10%")).toBeDefined();
		expect(screen.getByText("In Stock")).toBeDefined();
		expect(screen.getByText("Stock: 42")).toBeDefined();
		expect(screen.getByText("SKU: TEST-001")).toBeDefined();
		expect(screen.getByText("4.5 / 5")).toBeDefined();
		expect(screen.getByText("123 reviews")).toBeDefined();
	});

	it("shows error state when fetch rejects", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.reject(new Error("Network error")))
		);

		render(<ProductDetails id="1" />);

		await waitFor(() => {
			expect(screen.getByText("Something went wrong.")).toBeDefined();
		});

		expect(screen.getByRole("button", { name: "Retry" })).toBeDefined();
	});

	it("shows error state when response is not ok", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve({ ok: false }))
		);

		render(<ProductDetails id="1" />);

		await waitFor(() => {
			expect(screen.getByText("Something went wrong.")).toBeDefined();
		});

		expect(screen.getByRole("button", { name: "Retry" })).toBeDefined();
	});

	it("retries fetch when retry button is clicked", async () => {
		const fetchMock = vi
			.fn()
			.mockRejectedValueOnce(new Error("Network error"))
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockProduct),
			});

		vi.stubGlobal("fetch", fetchMock);

		render(<ProductDetails id="1" />);

		await waitFor(() => {
			expect(screen.getByText("Something went wrong.")).toBeDefined();
		});

		fireEvent.click(screen.getByRole("button", { name: "Retry" }));

		await waitFor(() => {
			expect(screen.getByText("Test Product")).toBeDefined();
		});

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});
