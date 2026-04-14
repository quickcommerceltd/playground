import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { DatabaseService } from "../database/database.service";
import { ProductsService } from "./products.service";

describe("ProductsService", () => {
	let service: ProductsService;
	type FindAllResult = Awaited<ReturnType<ProductsService["findAll"]>>;
	type NonArrayFindAllResult = Exclude<FindAllResult, unknown[]>;
	type PageResult = Extract<
		NonArrayFindAllResult,
		{ pagination: { mode: "page" } }
	>;
	type CursorResult = Extract<
		NonArrayFindAllResult,
		{ pagination: { mode: "cursor" } }
	>;
	const expectProductsArray = (result: FindAllResult) => {
		expect(Array.isArray(result)).toBe(true);
		if (!Array.isArray(result)) {
			throw new TypeError("Expected a product array result");
		}

		return result;
	};
	const expectPageResult = (result: FindAllResult): PageResult => {
		expect(Array.isArray(result)).toBe(false);
		if (Array.isArray(result) || result.pagination.mode !== "page") {
			throw new TypeError("Expected a page-based pagination result");
		}

		return result as PageResult;
	};
	const expectCursorResult = (result: FindAllResult): CursorResult => {
		expect(Array.isArray(result)).toBe(false);
		if (Array.isArray(result) || result.pagination.mode !== "cursor") {
			throw new TypeError("Expected a cursor-based pagination result");
		}

		return result as CursorResult;
	};

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ProductsService, DatabaseService],
		}).compile();

		process.env.DATABASE_PATH = ":memory:";
		service = module.get(ProductsService);

		// Trigger table creation
		const db = module.get(DatabaseService);
		db.onModuleInit();

		// Insert test products
		db.run(
			"INSERT INTO products (name, price, sku, category, brand, stock_quantity, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
			["In-Stock Widget", 999, "TST-001", "Electronics", "Acme", 10, 1],
		);
		db.run(
			"INSERT INTO products (name, price, sku, category, brand, stock_quantity, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
			["Out-of-Stock Gadget", 1999, "TST-002", "Electronics", "Zenith", 0, 1],
		);
		db.run(
			"INSERT INTO products (name, price, sku, category, brand, stock_quantity, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
			["Correctly-Out Widget", 2999, "TST-003", "Home", null, 0, 0],
		);
	});

	describe("findAll", () => {
		it("should return in_stock=1 when stock_quantity > 0", async () => {
			const products = expectProductsArray(await service.findAll());
			const product = products.find((p) => p.sku === "TST-001");
			expect(product?.in_stock).toBe(1);
		});

		it("should return in_stock=0 when stock_quantity is 0, even if DB flag says 1", async () => {
			const products = expectProductsArray(await service.findAll());
			const product = products.find((p) => p.sku === "TST-002");
			expect(product?.stock_quantity).toBe(0);
			expect(product?.in_stock).toBe(0);
		});

		it("should return in_stock=0 when stock_quantity is 0 and DB flag is also 0", async () => {
			const products = expectProductsArray(await service.findAll());
			const product = products.find((p) => p.sku === "TST-003");
			expect(product?.in_stock).toBe(0);
		});

		it("should filter products by categories", async () => {
			const products = expectProductsArray(
				await service.findAll({
					categories: ["Home"],
				}),
			);

			expect(products).toHaveLength(1);
			expect(products[0]?.sku).toBe("TST-003");
			expect(products[0]?.category).toBe("Home");
		});

		it("should filter products by brands", async () => {
			const products = expectProductsArray(
				await service.findAll({
					brands: ["Acme"],
				}),
			);

			expect(products).toHaveLength(1);
			expect(products[0]?.sku).toBe("TST-001");
			expect(products[0]?.brand).toBe("Acme");
		});

		it("should filter products by price range", async () => {
			const products = expectProductsArray(
				await service.findAll({
					minPrice: 1000,
					maxPrice: 2500,
				}),
			);

			expect(products).toHaveLength(1);
			expect(products[0]?.sku).toBe("TST-002");
			expect(products[0]?.price).toBe(1999);
		});

		it("should filter products by in-stock state", async () => {
			const inStockProducts = expectProductsArray(
				await service.findAll({
					inStock: true,
				}),
			);
			const outOfStockProducts = expectProductsArray(
				await service.findAll({
					inStock: false,
				}),
			);

			expect(inStockProducts.map((product) => product.sku)).toEqual([
				"TST-001",
			]);
			expect(outOfStockProducts.map((product) => product.sku)).toEqual([
				"TST-002",
				"TST-003",
			]);
		});

		it("should search products by name and SKU", async () => {
			const byName = expectProductsArray(
				await service.findAll({
					search: "in-stock",
				}),
			);
			const bySku = expectProductsArray(
				await service.findAll({
					search: "TST-003",
				}),
			);

			expect(byName.map((product) => product.sku)).toEqual(["TST-001"]);
			expect(bySku.map((product) => product.sku)).toEqual(["TST-003"]);
		});

		it("should apply sort allowlist to products", async () => {
			const products = expectProductsArray(
				await service.findAll({
					sortBy: "price",
					sortDir: "desc",
				}),
			);

			expect(products.map((product) => product.sku)).toEqual([
				"TST-003",
				"TST-002",
				"TST-001",
			]);
		});

		it("should return page-based pagination metadata", async () => {
			const result = expectPageResult(
				await service.findAll({
					pagination: "page",
					page: 2,
					pageSize: 1,
				}),
			);

			expect(result.pagination).toEqual({
				mode: "page",
				page: 2,
				pageSize: 1,
				total: 3,
				totalPages: 3,
			});
			expect(result.items).toHaveLength(1);
			expect(result.items[0]?.sku).toBe("TST-002");
		});

		it("should return cursor-based pagination metadata", async () => {
			const firstPage = expectCursorResult(
				await service.findAll({
					pagination: "cursor",
					limit: 2,
				}),
			);

			expect(firstPage.items.map((product) => product.sku)).toEqual([
				"TST-001",
				"TST-002",
			]);
			expect(firstPage.pagination).toEqual({
				mode: "cursor",
				limit: 2,
				nextCursor: firstPage.items[1]?.id ?? null,
				hasMore: true,
			});

			const secondPage = expectCursorResult(
				await service.findAll({
					pagination: "cursor",
					limit: 2,
					cursor: firstPage.pagination.nextCursor ?? undefined,
				}),
			);

			expect(secondPage.items.map((product) => product.sku)).toEqual([
				"TST-003",
			]);
			expect(secondPage.pagination).toEqual({
				mode: "cursor",
				limit: 2,
				nextCursor: null,
				hasMore: false,
			});
		});
	});

	describe("findById", () => {
		it("should return in_stock=0 for a product with stock_quantity=0 even if DB flag is 1", async () => {
			const products = expectProductsArray(await service.findAll());
			const target = products.find((p) => p.sku === "TST-002");
			expect(target).toBeDefined();
			const product = (await service.findById(target?.id as number)) as {
				in_stock: number;
				stock_quantity: number;
			};
			expect(product.stock_quantity).toBe(0);
			expect(product.in_stock).toBe(0);
		});

		it("should return in_stock=1 for a product with stock_quantity > 0", async () => {
			const products = expectProductsArray(await service.findAll());
			const target = products.find((p) => p.sku === "TST-001");
			expect(target).toBeDefined();
			const product = (await service.findById(target?.id as number)) as {
				in_stock: number;
				stock_quantity: number;
			};
			expect(product.stock_quantity).toBe(10);
			expect(product.in_stock).toBe(1);
		});
	});

	describe("findBrands", () => {
		it("should return a sorted unique list of non-empty brands", async () => {
			const brands = await service.findBrands();
			expect(brands).toEqual(["Acme", "Zenith"]);
		});
	});

	describe("create", () => {
		it("should return in_stock=0 for a newly created product with default stock_quantity", async () => {
			const product = (await service.create({
				name: "New Product",
				price: 1999,
				sku: "TST-NEW-001",
				category: "Test",
			})) as { in_stock: number; stock_quantity: number; name: string };
			expect(product.name).toBe("New Product");
			expect(product.stock_quantity).toBe(0);
			expect(product.in_stock).toBe(0);
		});

		it("should throw ConflictException when the SKU already exists", async () => {
			await expect(
				service.create({
					name: "Duplicate SKU Product",
					price: 1999,
					sku: "TST-001",
					category: "Test",
				}),
			).rejects.toBeInstanceOf(ConflictException);
		});
	});
});
