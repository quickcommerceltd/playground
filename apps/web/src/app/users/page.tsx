import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserList, type UserListItem } from "@/components/user-list";
import { UsersSearchControls } from "@/components/users-search-controls";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";
const USERS_PAGE_SIZE = 12;

type UsersPageSearchParams = Promise<{
	search?: string | string[];
	sort?: string | string[];
	role?: string | string[];
	status?: string | string[];
	page?: string | string[];
}>;

const getFirstParamValue = (value?: string | string[]) =>
	Array.isArray(value) ? value[0] : value;

type UsersListQuery = {
	search?: string;
	sort: string;
	role?: string;
	status?: string;
	page: number;
};

type PaginatedUsersResponse = {
	items: UserListItem[];
	pagination: {
		mode: "page";
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};

const mapSortToApiParams = (sort: string) => {
	if (sort === "name_asc") {
		return { sortBy: "name", sortDir: "asc" } as const;
	}

	if (sort === "name_desc") {
		return { sortBy: "name", sortDir: "desc" } as const;
	}

	if (sort === "created_asc") {
		return { sortBy: "created_at", sortDir: "asc" } as const;
	}

	if (sort === "created_desc") {
		return { sortBy: "created_at", sortDir: "desc" } as const;
	}

	return undefined;
};

const getUsers = async (
	searchParams: UsersListQuery,
): Promise<PaginatedUsersResponse> => {
	const queryParams = new URLSearchParams();
	queryParams.set("pagination", "page");
	queryParams.set("page", String(searchParams.page));
	queryParams.set("pageSize", String(USERS_PAGE_SIZE));

	if (searchParams.search) {
		queryParams.set("search", searchParams.search);
	}

	if (searchParams.role) {
		queryParams.set("roles", searchParams.role);
	}

	if (searchParams.status === "active") {
		queryParams.set("isActive", "true");
	}

	if (searchParams.status === "inactive") {
		queryParams.set("isActive", "false");
	}

	const sortParams = mapSortToApiParams(searchParams.sort);
	if (sortParams) {
		queryParams.set("sortBy", sortParams.sortBy);
		queryParams.set("sortDir", sortParams.sortDir);
	}

	const requestUrl = `${API_URL}/v2/users?${queryParams.toString()}`;
	const response = await fetch(requestUrl, {
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Failed to load users.");
	}

	return response.json();
};

const extractRoles = (users: UserListItem[]) =>
	Array.from(
		new Set(users.map((user) => user.role?.trim()).filter(Boolean)),
	).sort((leftRole, rightRole) => leftRole.localeCompare(rightRole));

const getRolesList = async (): Promise<string[]> => {
	const queryParams = new URLSearchParams();
	queryParams.set("pagination", "page");
	queryParams.set("page", "1");
	queryParams.set("pageSize", "100");
	queryParams.set("sortBy", "role");
	queryParams.set("sortDir", "asc");
	const response = await fetch(
		`${API_URL}/v2/users?${queryParams.toString()}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to load roles list.");
	}

	const payload = (await response.json()) as PaginatedUsersResponse;
	return extractRoles(payload.items);
};

const buildPageHref = (query: UsersListQuery, nextPage: number) => {
	const params = new URLSearchParams();

	if (query.search) {
		params.set("search", query.search);
	}

	if (query.sort) {
		params.set("sort", query.sort);
	}

	if (query.role) {
		params.set("role", query.role);
	}

	if (query.status) {
		params.set("status", query.status);
	}

	params.set("page", String(nextPage));
	return `/users?${params.toString()}`;
};

const UsersPage = async ({
	searchParams,
}: {
	searchParams: UsersPageSearchParams;
}) => {
	let users: UserListItem[] = [];
	let roles: string[] = [];
	let error: string | null = null;
	let currentPage = 1;
	let totalPages = 1;
	const resolvedSearchParams = await searchParams;
	const parsedPage = Number(getFirstParamValue(resolvedSearchParams.page));
	const query = {
		search:
			getFirstParamValue(resolvedSearchParams.search)?.trim() || undefined,
		sort: getFirstParamValue(resolvedSearchParams.sort)?.trim() || "",
		role: getFirstParamValue(resolvedSearchParams.role)?.trim() || undefined,
		status:
			getFirstParamValue(resolvedSearchParams.status)?.trim() || undefined,
		page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
	};

	try {
		const response = await getUsers(query);
		users = response.items;
		currentPage = response.pagination.page;
		totalPages = response.pagination.totalPages;
	} catch {
		error = "Failed to load users. Please try again later.";
	}

	try {
		roles = await getRolesList();
	} catch {
		roles = extractRoles(users);
	}

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Users</h1>
			<UsersSearchControls roles={roles} />
			{error ? (
				<p role="alert">{error}</p>
			) : (
				<>
					<UserList users={users} />
					{totalPages > 1 && (
						<nav
							aria-label="Users pagination"
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

export default UsersPage;
