import Link from "next/link";
import { ProductList, type ProductListItem } from "@/components/product-list";
import { ProductsSearchControls } from "@/components/products-search-controls";
import { Button } from "@/components/ui/button";
import {
	buildProductsRequestUrl,
	type ProductsRequestQuery,
} from "./products-page.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";
const PRODUCTS_PAGE_SIZE = 12;

type ProductsPageSearchParams = Promise<{
	search?: string | string[];
	sort?: string | string[];
	category?: string | string[];
	brand?: string | string[];
	minPrice?: string | string[];
	maxPrice?: string | string[];
	page?: string | string[];
}>;

const getFirstParamValue = (value?: string | string[]) =>
	Array.isArray(value) ? value[0] : value;

type PaginatedProductsResponse = {
	items: ProductListItem[];
	pagination: {
		mode: "page";
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};

const getProducts = async (
	searchParams: ProductsRequestQuery,
): Promise<PaginatedProductsResponse> => {
	const requestUrl = buildProductsRequestUrl(
		API_URL,
		searchParams,
		PRODUCTS_PAGE_SIZE,
	);
	const response = await fetch(requestUrl, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Failed to load products.");
	}

	return response.json();
};

const extractBrands = (products: ProductListItem[]) =>
	Array.from(
		new Set(
			products
				.map((product) => product.brand?.trim())
				.filter((brand): brand is string => Boolean(brand)),
		),
	).sort((leftBrand, rightBrand) => leftBrand.localeCompare(rightBrand));

const getBrandsList = async (): Promise<string[]> => {
	const response = await fetch(`${API_URL}/v2/products/brands`, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Failed to load brands list.");
	}

	const payload = (await response.json()) as string[];
	return payload;
};

const buildPageHref = (
	query: ProductsRequestQuery & { sort: string },
	nextPage: number,
) => {
	const params = new URLSearchParams();

	if (query.search) {
		params.set("search", query.search);
	}

	if (query.sort) {
		params.set("sort", query.sort);
	}

	if (query.category) {
		params.set("category", query.category);
	}

	if (query.brand) {
		params.set("brand", query.brand);
	}

	if (query.minPrice) {
		params.set("minPrice", query.minPrice);
	}

	if (query.maxPrice) {
		params.set("maxPrice", query.maxPrice);
	}

	params.set("page", String(nextPage));
	return `/products?${params.toString()}`;
};

const ProductsPage = async ({
	searchParams,
}: {
	searchParams: ProductsPageSearchParams;
}) => {
	let products: ProductListItem[] = [];
	let brands: string[] = [];
	let error: string | null = null;
	let currentPage = 1;
	let totalPages = 1;
	const resolvedSearchParams = await searchParams;
	const parsedPage = Number(getFirstParamValue(resolvedSearchParams.page));
	const query = {
		search:
			getFirstParamValue(resolvedSearchParams.search)?.trim() || undefined,
		sort: getFirstParamValue(resolvedSearchParams.sort)?.trim() || "",
		category:
			getFirstParamValue(resolvedSearchParams.category)?.trim() || undefined,
		brand: getFirstParamValue(resolvedSearchParams.brand)?.trim() || undefined,
		minPrice:
			getFirstParamValue(resolvedSearchParams.minPrice)?.trim() || undefined,
		maxPrice:
			getFirstParamValue(resolvedSearchParams.maxPrice)?.trim() || undefined,
		page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
	};

	try {
		const response = await getProducts(query);
		products = response.items;
		currentPage = response.pagination.page;
		totalPages = response.pagination.totalPages;
	} catch {
		error = "Failed to load products. Please try again later.";
	}

	try {
		brands = await getBrandsList();
	} catch {
		brands = extractBrands(products);
	}

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Products</h1>
			<ProductsSearchControls brands={brands} />
			{error ? (
				<p role="alert">{error}</p>
			) : (
				<>
					<ProductList products={products} />
					{totalPages > 1 && (
						<nav
							aria-label="Products pagination"
							className="mt-6 flex items-center justify-between gap-3"
						>
							{currentPage <= 1 ? (
								<Button variant="outline" size="sm" disabled>
									Previous
								</Button>
							) : (
								<Button asChild variant="outline" size="sm">
									<Link href={buildPageHref(query, currentPage - 1)}>
										Previous
									</Link>
								</Button>
							)}
							<p className="text-sm text-muted-foreground">
								Page {currentPage} of {totalPages}
							</p>
							{currentPage >= totalPages ? (
								<Button variant="outline" size="sm" disabled>
									Next
								</Button>
							) : (
								<Button asChild variant="outline" size="sm">
									<Link href={buildPageHref(query, currentPage + 1)}>Next</Link>
								</Button>
							)}
						</nav>
					)}
				</>
			)}
		</div>
	);
};

export default ProductsPage;
