import { describe, expect, it } from "vitest";
import {
	buildProductsRequestUrl,
	mapProductSortToApiParams,
} from "./products-page.utils";

describe("products-page.utils", () => {
	it("maps UI sort values to API sort fields", () => {
		expect(mapProductSortToApiParams("price_desc")).toEqual({
			sortBy: "price",
			sortDir: "desc",
		});
		expect(mapProductSortToApiParams("name_asc")).toEqual({
			sortBy: "name",
			sortDir: "asc",
		});
		expect(mapProductSortToApiParams("unknown")).toBeUndefined();
	});

	it("builds the products request URL with server-side sort params", () => {
		const requestUrl = buildProductsRequestUrl(
			"http://localhost:4992",
			{
				search: "watch",
				sort: "price_desc",
				category: "Electronics",
				brand: "TechPulse",
				minPrice: "1000",
				maxPrice: "50000",
				page: 2,
			},
			12,
		);
		const url = new URL(requestUrl);

		expect(url.pathname).toBe("/v2/products");
		expect(url.searchParams.get("pagination")).toBe("page");
		expect(url.searchParams.get("page")).toBe("2");
		expect(url.searchParams.get("pageSize")).toBe("12");
		expect(url.searchParams.get("search")).toBe("watch");
		expect(url.searchParams.get("categories")).toBe("Electronics");
		expect(url.searchParams.get("brands")).toBe("TechPulse");
		expect(url.searchParams.get("minPrice")).toBe("1000");
		expect(url.searchParams.get("maxPrice")).toBe("50000");
		expect(url.searchParams.get("sortBy")).toBe("price");
		expect(url.searchParams.get("sortDir")).toBe("desc");
	});
});
