import { z } from "zod";
import { type UserFilters, type UserSortBy } from "../users.service";

export type FindUsersQueryDto = {
	role?: string | string[];
	roles?: string | string[];
	isActive?: string;
	search?: string;
	createdAfter?: string;
	createdBefore?: string;
	sortBy?: string;
	sortDir?: string;
	pagination?: string;
	surface?: string;
	page?: string;
	pageSize?: string;
	cursor?: string;
	limit?: string;
};

export const findUsersQueryDtoSchema = z.object({
	role: z.union([z.string(), z.array(z.string())]).optional(),
	roles: z.union([z.string(), z.array(z.string())]).optional(),
	isActive: z.string().optional(),
	search: z.string().optional(),
	createdAfter: z.string().optional(),
	createdBefore: z.string().optional(),
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

const sortableFields: UserSortBy[] = [
	"id",
	"name",
	"email",
	"role",
	"created_at",
	"updated_at",
];

const parseSortByQueryValue = (value?: string) => {
	const normalizedValue = value?.trim().toLowerCase();
	if (!normalizedValue) {
		return undefined;
	}

	const resolvedSortBy = sortableFields.find(
		(field) => field === normalizedValue,
	);
	return resolvedSortBy;
};

const parseSortDirectionQueryValue = (value?: string) => {
	const normalizedValue = value?.trim().toLowerCase();
	if (normalizedValue === "asc" || normalizedValue === "desc") {
		return normalizedValue;
	}

	return undefined;
};

export const mapFindUsersQueryToFilters = (
	query: FindUsersQueryDto = {},
): UserFilters => {
	const filters: UserFilters = {};
	const roles = Array.from(
		new Set([
			...parseListQueryValue(query.role),
			...parseListQueryValue(query.roles),
		]),
	);
	const isActive = parseBooleanQueryValue(query.isActive);
	const page = parseNumberQueryValue(query.page);
	const pageSize = parseNumberQueryValue(query.pageSize);
	const cursor = parseNumberQueryValue(query.cursor);
	const limit = parseNumberQueryValue(query.limit);
	const pagination = parsePaginationQueryValue(query.pagination, query.surface);
	const sortBy = parseSortByQueryValue(query.sortBy);
	const sortDir = parseSortDirectionQueryValue(query.sortDir);
	const search = query.search?.trim();
	const createdAfter = query.createdAfter?.trim();
	const createdBefore = query.createdBefore?.trim();

	if (roles.length) {
		filters.roles = roles;
	}

	if (isActive !== undefined) {
		filters.isActive = isActive;
	}

	if (search) {
		filters.search = search;
	}

	if (createdAfter) {
		filters.createdAfter = createdAfter;
	}

	if (createdBefore) {
		filters.createdBefore = createdBefore;
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
