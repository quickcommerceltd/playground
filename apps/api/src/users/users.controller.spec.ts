import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, expect, it, vi } from "vitest";
import { UsersV2Controller } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersV1Controller } from "./users-v1.controller";

describe("UsersV1Controller", () => {
	it("should return all users as a flat array", async () => {
		const mockUsers = [
			{ id: 1, name: "Alice", email: "alice@example.com" },
			{ id: 2, name: "Bob", email: "bob@example.com" },
		];
		const findAllMock = vi.fn().mockReturnValue(mockUsers);

		const module = await Test.createTestingModule({
			controllers: [UsersV1Controller],
			providers: [
				{
					provide: UsersService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(UsersV1Controller);
		expect(controller.findAll()).toEqual(mockUsers);
		expect(findAllMock).toHaveBeenCalledWith();
	});
});

describe("UsersV2Controller", () => {
	it("should return all users with empty filters by default", async () => {
		const findAllMock = vi.fn().mockReturnValue([]);

		const module = await Test.createTestingModule({
			controllers: [UsersV2Controller],
			providers: [
				{
					provide: UsersService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(UsersV2Controller);
		expect(controller.findAll()).toEqual([]);
		expect(findAllMock).toHaveBeenCalledWith({});
	});

	it("should parse find-all query before calling service", async () => {
		const findAllMock = vi.fn().mockReturnValue([]);

		const module = await Test.createTestingModule({
			controllers: [UsersV2Controller],
			providers: [
				{
					provide: UsersService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(UsersV2Controller);
		controller.findAll({
			role: "admin,customer",
			isActive: "false",
			search: "alice",
			sortBy: "created_at",
			sortDir: "desc",
			pagination: "page",
			page: "2",
			pageSize: "10",
			createdAfter: "2024-01-01",
			createdBefore: "2024-12-31",
		});

		expect(findAllMock).toHaveBeenCalledWith({
			roles: ["admin", "customer"],
			isActive: false,
			search: "alice",
			sortBy: "created_at",
			sortDir: "desc",
			pagination: "page",
			page: 2,
			pageSize: 10,
			createdAfter: "2024-01-01",
			createdBefore: "2024-12-31",
		});
	});

	it("should map surface query to cursor pagination mode", async () => {
		const findAllMock = vi.fn().mockReturnValue([]);

		const module = await Test.createTestingModule({
			controllers: [UsersV2Controller],
			providers: [
				{
					provide: UsersService,
					useValue: { findAll: findAllMock },
				},
			],
		}).compile();

		const controller = module.get(UsersV2Controller);
		controller.findAll({
			surface: "mobile",
			cursor: "25",
			limit: "15",
		});

		expect(findAllMock).toHaveBeenCalledWith({
			pagination: "cursor",
			cursor: 25,
			limit: 15,
		});
	});

	it("should throw NotFoundException when a user does not exist", async () => {
		const module = await Test.createTestingModule({
			controllers: [UsersV2Controller],
			providers: [
				{
					provide: UsersService,
					useValue: {
						findAll: vi.fn(),
						findById: vi.fn().mockResolvedValue(undefined),
					},
				},
			],
		}).compile();

		const controller = module.get(UsersV2Controller);
		await expect(controller.findById(404)).rejects.toBeInstanceOf(
			NotFoundException,
		);
	});
});
