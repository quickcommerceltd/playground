"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type UsersSearchControlsProps = {
	roles: string[];
};

export const UsersSearchControls = ({ roles }: UsersSearchControlsProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [sort, setSort] = useState(searchParams.get("sort") ?? "");
	const [role, setRole] = useState(searchParams.get("role") ?? "");
	const [status, setStatus] = useState(searchParams.get("status") ?? "");
	const [showFilters, setShowFilters] = useState(
		Boolean(searchParams.get("role") || searchParams.get("status")),
	);

	useEffect(() => {
		setSearch(searchParams.get("search") ?? "");
		setSort(searchParams.get("sort") ?? "");
		setRole(searchParams.get("role") ?? "");
		setStatus(searchParams.get("status") ?? "");
		setShowFilters(
			Boolean(searchParams.get("role") || searchParams.get("status")),
		);
	}, [searchParams]);

	const activeFilterCount = [role, status].filter(Boolean).length;

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextParams = new URLSearchParams(searchParams.toString());
		const entries = [
			["search", search.trim()],
			["sort", sort.trim()],
			["role", role.trim()],
			["status", status.trim()],
		] as const;

		entries.forEach(([key, value]) => {
			if (value) {
				nextParams.set(key, value);
				return;
			}

			nextParams.delete(key);
		});

		nextParams.set("page", "1");
		router.push(`/users?${nextParams.toString()}`);
	};

	const onClear = () => {
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.delete("search");
		nextParams.delete("sort");
		nextParams.delete("role");
		nextParams.delete("status");
		nextParams.set("page", "1");
		setSearch("");
		setSort("");
		setRole("");
		setStatus("");
		setShowFilters(false);
		router.push(`/users?${nextParams.toString()}`);
	};

	const hasAnyValue = search || sort || role || status;

	return (
		<form onSubmit={onSubmit} className="mb-8 space-y-3">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<label htmlFor="users-search" className="sr-only">
						Search users
					</label>
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						id="users-search"
						type="search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by name, email, phone..."
						className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<label htmlFor="users-sort" className="sr-only">
						Sort users
					</label>
					<select
						id="users-sort"
						value={sort}
						onChange={(event) => setSort(event.target.value)}
						className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:flex-none"
					>
						<option value="">Sort by</option>
						<option value="name_asc">Name: A to Z</option>
						<option value="name_desc">Name: Z to A</option>
						<option value="created_desc">Created: Newest first</option>
						<option value="created_asc">Created: Oldest first</option>
					</select>
					<Button type="submit" size="sm">
						<Search className="h-4 w-4" />
						Search
					</Button>
					{hasAnyValue && (
						<Button type="button" variant="ghost" size="sm" onClick={onClear}>
							<X className="h-4 w-4" />
							Clear
						</Button>
					)}
					<Button
						type="button"
						variant={showFilters ? "secondary" : "outline"}
						size="sm"
						onClick={() => setShowFilters((current) => !current)}
					>
						<SlidersHorizontal className="h-4 w-4" />
						Filters
						{activeFilterCount > 0 && (
							<span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
								{activeFilterCount}
							</span>
						)}
					</Button>
				</div>
			</div>

			{showFilters && (
				<div className="rounded-lg border border-input bg-muted/30 p-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<label
								htmlFor="filter-role"
								className="text-xs font-medium text-muted-foreground"
							>
								Role
							</label>
							<select
								id="filter-role"
								value={role}
								onChange={(event) => setRole(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<option value="">All roles</option>
								{roles.map((roleOption) => (
									<option key={roleOption} value={roleOption}>
										{roleOption}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="filter-status"
								className="text-xs font-medium text-muted-foreground"
							>
								Status
							</label>
							<select
								id="filter-status"
								value={status}
								onChange={(event) => setStatus(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<option value="">All statuses</option>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</form>
	);
};
