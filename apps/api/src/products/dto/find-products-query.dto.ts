import { z } from "zod";
import { type ProductFilters, type ProductSortBy } from "../products.service";

export type FindProductsQueryDto = {
	categories?: string | string[];
	brands?: string | string[];
	minPrice?: string;
	maxPrice?: string;
	inStock?: string;
	search?: string;
	sortBy?: string;
	sortDir?: string;
	pagination?: string;
	surface?: string;
	page?: string;
	pageSize?: string;
	cursor?: string;
	limit?: string;
};

export const findProductsQueryDtoSchema = z.object({
	categories: z.union([z.string(), z.array(z.string())]).optional(),
	brands: z.union([z.string(), z.array(z.string())]).optional(),
	minPrice: z.string().optional(),
	maxPrice: z.string().optional(),
	inStock: z.string().optional(),
	search: z.string().optional(),
	sortBy: z.string().optional(),
	sortDir: z.string().optional(),
	pagination: z.string().optional(),
	surface: z.string().optional(),
	page: z.string().optional(),
	pageSize: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.string().optional(),
});

const parseListQueryValue = (value?: string | string[]) => {
	const values = Array.isArray(value) ? value : value ? [value] : [];
	return values
		.flatMap((entry) => entry.split(","))
		.map((entry) => entry.trim())
		.filter(Boolean);
};

const parseNumberQueryValue = (value?: string) => {
	if (value === undefined) {
		return undefined;
	}

	const parsedValue = Number(value);
	return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const parseBooleanQueryValue = (value?: string) => {
	if (!value) {
		return undefined;
	}

	const normalizedValue = value.trim().toLowerCase();

	if (normalizedValue === "true" || normalizedValue === "1") {
		return true;
	}

	if (normalizedValue === "false" || normalizedValue === "0") {
		return false;
	}

	return undefined;
};

const parsePaginationQueryValue = (value?: string, surface?: string) => {
	const normalizedValue = value?.trim().toLowerCase();
	const normalizedSurface = surface?.trim().toLowerCase();

	if (normalizedValue === "page" || normalizedValue === "cursor") {
		return normalizedValue;
	}

	if (normalizedSurface === "web") {
		return "page";
	}

	if (normalizedSurface === "native" || normalizedSurface === "mobile") {
		return "cursor";
	}

	return undefined;
};

const sortableFields: ProductSortBy[] = [
	"id",
	"name",
	"price",
	"created_at",
	"updated_at",
];

const parseSortByQueryValue = (value?: string) => {
	const normalizedValue = value?.trim().toLowerCase();
	if (!normalizedValue) {
		return undefined;
	}

	return sortableFields.find((field) => field === normalizedValue);
};

const parseSortDirectionQueryValue = (value?: string) => {
	const normalizedValue = value?.trim().toLowerCase();
	if (normalizedValue === "asc" || normalizedValue === "desc") {
		return normalizedValue;
	}

	return undefined;
};

export const mapFindProductsQueryToFilters = (
	query: FindProductsQueryDto = {},
): ProductFilters => {
	const filters: ProductFilters = {};
	const categories = parseListQueryValue(query.categories);
	const brands = parseListQueryValue(query.brands);
	const minPrice = parseNumberQueryValue(query.minPrice);
	const maxPrice = parseNumberQueryValue(query.maxPrice);
	const inStock = parseBooleanQueryValue(query.inStock);
	const page = parseNumberQueryValue(query.page);
	const pageSize = parseNumberQueryValue(query.pageSize);
	const cursor = parseNumberQueryValue(query.cursor);
	const limit = parseNumberQueryValue(query.limit);
	const pagination = parsePaginationQueryValue(query.pagination, query.surface);
	const search = query.search?.trim();
	const sortBy = parseSortByQueryValue(query.sortBy);
	const sortDir = parseSortDirectionQueryValue(query.sortDir);

	if (categories.length) {
		filters.categories = categories;
	}

	if (brands.length) {
		filters.brands = brands;
	}

	if (minPrice !== undefined) {
		filters.minPrice = minPrice;
	}

	if (maxPrice !== undefined) {
		filters.maxPrice = maxPrice;
	}

	if (inStock !== undefined) {
		filters.inStock = inStock;
	}

	if (search) {
		filters.search = search;
	}

	if (sortBy) {
		filters.sortBy = sortBy;
	}

	if (sortDir) {
		filters.sortDir = sortDir;
	}

	if (pagination) {
		filters.pagination = pagination;
	}

	if (page !== undefined) {
		filters.page = page;
	}

	if (pageSize !== undefined) {
		filters.pageSize = pageSize;
	}

	if (cursor !== undefined) {
		filters.cursor = cursor;
	}

	if (limit !== undefined) {
		filters.limit = limit;
	}

	return filters;
};
