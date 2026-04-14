"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ProductsSearchControlsProps = {
	brands: string[];
};

export const ProductsSearchControls = ({
	brands,
}: ProductsSearchControlsProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [sort, setSort] = useState(searchParams.get("sort") ?? "");
	const [category, setCategory] = useState(searchParams.get("category") ?? "");
	const [brand, setBrand] = useState(searchParams.get("brand") ?? "");
	const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
	const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
	const [showFilters, setShowFilters] = useState(
		Boolean(
			searchParams.get("category") ||
				searchParams.get("brand") ||
				searchParams.get("minPrice") ||
				searchParams.get("maxPrice"),
		),
	);

	useEffect(() => {
		setSearch(searchParams.get("search") ?? "");
		setSort(searchParams.get("sort") ?? "");
		setCategory(searchParams.get("category") ?? "");
		setBrand(searchParams.get("brand") ?? "");
		setMinPrice(searchParams.get("minPrice") ?? "");
		setMaxPrice(searchParams.get("maxPrice") ?? "");
		setShowFilters(
			Boolean(
				searchParams.get("category") ||
					searchParams.get("brand") ||
					searchParams.get("minPrice") ||
					searchParams.get("maxPrice"),
			),
		);
	}, [searchParams]);

	const activeFilterCount = [category, brand, minPrice, maxPrice].filter(
		Boolean,
	).length;

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextParams = new URLSearchParams(searchParams.toString());
		const entries = [
			["search", search.trim()],
			["sort", sort.trim()],
			["category", category.trim()],
			["brand", brand.trim()],
			["minPrice", minPrice.trim()],
			["maxPrice", maxPrice.trim()],
		] as const;

		entries.forEach(([key, value]) => {
			if (value) {
				nextParams.set(key, value);
				return;
			}

			nextParams.delete(key);
		});

		nextParams.set("page", "1");
		router.push(`/products?${nextParams.toString()}`);
	};

	const onClear = () => {
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.delete("search");
		nextParams.delete("sort");
		nextParams.delete("category");
		nextParams.delete("brand");
		nextParams.delete("minPrice");
		nextParams.delete("maxPrice");
		nextParams.set("page", "1");
		setSearch("");
		setSort("");
		setCategory("");
		setBrand("");
		setMinPrice("");
		setMaxPrice("");
		setShowFilters(false);
		router.push(`/products?${nextParams.toString()}`);
	};

	const hasAnyValue =
		search || sort || category || brand || minPrice || maxPrice;

	return (
		<form onSubmit={onSubmit} className="mb-8 space-y-3">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<label htmlFor="products-search" className="sr-only">
						Search products
					</label>
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						id="products-search"
						type="search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by name, SKU, brand, category..."
						className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<label htmlFor="products-sort" className="sr-only">
						Sort products
					</label>
					<select
						id="products-sort"
						value={sort}
						onChange={(event) => setSort(event.target.value)}
						className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:flex-none"
					>
						<option value="">Sort by</option>
						<option value="price_asc">Price: Low to High</option>
						<option value="price_desc">Price: High to Low</option>
						<option value="name_asc">Name: A to Z</option>
						<option value="name_desc">Name: Z to A</option>
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
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-1.5">
							<label
								htmlFor="filter-category"
								className="text-xs font-medium text-muted-foreground"
							>
								Category
							</label>
							<input
								id="filter-category"
								type="text"
								value={category}
								onChange={(event) => setCategory(event.target.value)}
								placeholder="e.g. Electronics"
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							/>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="filter-brand"
								className="text-xs font-medium text-muted-foreground"
							>
								Brand
							</label>
							<select
								id="filter-brand"
								value={brand}
								onChange={(event) => setBrand(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<option value="">All brands</option>
								{brands.map((brandOption) => (
									<option key={brandOption} value={brandOption}>
										{brandOption}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="filter-min-price"
								className="text-xs font-medium text-muted-foreground"
							>
								Min price
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									$
								</span>
								<input
									id="filter-min-price"
									type="number"
									value={minPrice}
									onChange={(event) => setMinPrice(event.target.value)}
									placeholder="0"
									min={0}
									className="h-9 w-full rounded-md border border-input bg-background pl-7 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="filter-max-price"
								className="text-xs font-medium text-muted-foreground"
							>
								Max price
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
									$
								</span>
								<input
									id="filter-max-price"
									type="number"
									value={maxPrice}
									onChange={(event) => setMaxPrice(event.target.value)}
									placeholder="Any"
									min={0}
									className="h-9 w-full rounded-md border border-input bg-background pl-7 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</form>
	);
};
