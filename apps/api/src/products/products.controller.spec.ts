import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, it, vi } from "vitest";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsV1Controller } from "./products-v1.controller";

describe("ProductsV1Controller", () => {
	it("should return all products as a flat array with no filters", async () => {
		const mockProducts = [
			{ id: 1, name: "Widget", price: 999, sku: "WDG-001" },
			{ id: 2, name: "Gadget", price: 1999, sku: "GDG-001" },
		];
		const findAllMock = vi.fn().mockReturnValue(mockProducts);

		const module = await Test.createTestingModule({
			controllers: [ProductsV1Controller],
			providers: [
				{
					provide: ProductsService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(ProductsV1Controller);
		expect(controller.findAll()).toEqual(mockProducts);
		expect(findAllMock).toHaveBeenCalledWith();
	});
});

describe("ProductsV2Controller", () => {
	it("should return all products with empty filters by default", async () => {
		const mockProducts = [
			{ id: 1, name: "Widget", price: 999, sku: "WDG-001" },
			{ id: 2, name: "Gadget", price: 1999, sku: "GDG-001" },
		];
		const findAllMock = vi.fn().mockReturnValue(mockProducts);

		const module = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(ProductsController);
		expect(controller.findAll()).toEqual(mockProducts);
		expect(findAllMock).toHaveBeenCalledWith({});
	});

	it("should parse query filters before calling service", async () => {
		const findAllMock = vi.fn().mockReturnValue([]);

		const module = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(ProductsController);
		controller.findAll({
			categories: "Electronics, Home",
			brands: ["Acme", "Zenith"],
			minPrice: "1000",
			maxPrice: "3000",
			inStock: "true",
			search: "widget",
			sortBy: "price",
			sortDir: "desc",
			pagination: "page",
			page: "2",
			pageSize: "24",
		});

		expect(findAllMock).toHaveBeenCalledWith({
			categories: ["Electronics", "Home"],
			brands: ["Acme", "Zenith"],
			minPrice: 1000,
			maxPrice: 3000,
			inStock: true,
			search: "widget",
			sortBy: "price",
			sortDir: "desc",
			pagination: "page",
			page: 2,
			pageSize: 24,
		});
	});

	it("should map surface query to pagination mode", async () => {
		const findAllMock = vi.fn().mockReturnValue([]);

		const module = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(ProductsController);
		controller.findAll({
			surface: "mobile",
			cursor: "10",
			limit: "12",
		});

		expect(findAllMock).toHaveBeenCalledWith({
			pagination: "cursor",
			cursor: 10,
			limit: 12,
		});
	});

	it("should return unique brands list", async () => {
		const findBrandsMock = vi.fn().mockReturnValue(["Acme", "Zenith"]);

		const module = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: { findAll: vi.fn(), findBrands: findBrandsMock },
				},
			],
		}).compile();

		const controller = module.get(ProductsController);
		expect(controller.findBrands()).toEqual(["Acme", "Zenith"]);
		expect(findBrandsMock).toHaveBeenCalledWith();
	});

	it("should throw NotFoundException when a product does not exist", async () => {
		const module = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: {
						findAll: vi.fn(),
						findById: vi.fn().mockResolvedValue(undefined),
						findBrands: vi.fn(),
					},
				},
			],
		}).compile();

		const controller = module.get(ProductsController);
		await expect(controller.findById(404)).rejects.toBeInstanceOf(
			NotFoundException,
		);
	});
});
