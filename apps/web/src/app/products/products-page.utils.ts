export type ProductsRequestQuery = {
	search?: string;
	sort?: string;
	category?: string;
	brand?: string;
	minPrice?: string;
	maxPrice?: string;
	page: number;
};

export const mapProductSortToApiParams = (sort?: string) => {
	if (sort === "price_asc") {
		return { sortBy: "price", sortDir: "asc" } as const;
	}

	if (sort === "price_desc") {
		return { sortBy: "price", sortDir: "desc" } as const;
	}

	if (sort === "name_asc") {
		return { sortBy: "name", sortDir: "asc" } as const;
	}

	if (sort === "name_desc") {
		return { sortBy: "name", sortDir: "desc" } as const;
	}

	return undefined;
};

export const buildProductsRequestUrl = (
	apiUrl: string,
	query: ProductsRequestQuery,
	pageSize: number,
) => {
	const queryParams = new URLSearchParams();
	queryParams.set("pagination", "page");
	queryParams.set("page", String(query.page));
	queryParams.set("pageSize", String(pageSize));

	if (query.search) {
		queryParams.set("search", query.search);
	}

	if (query.category) {
		queryParams.set("categories", query.category);
	}

	if (query.brand) {
		queryParams.set("brands", query.brand);
	}

	if (query.minPrice) {
		queryParams.set("minPrice", query.minPrice);
	}

	if (query.maxPrice) {
		queryParams.set("maxPrice", query.maxPrice);
	}

	const sortParams = mapProductSortToApiParams(query.sort);
	if (sortParams) {
		queryParams.set("sortBy", sortParams.sortBy);
		queryParams.set("sortDir", sortParams.sortDir);
	}

	return `${apiUrl}/v2/products?${queryParams.toString()}`;
};
