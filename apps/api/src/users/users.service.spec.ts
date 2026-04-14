import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { DatabaseService } from "../database/database.service";
import { UsersService } from "./users.service";

describe("UsersService", () => {
	let service: UsersService;
	type FindAllResult = Awaited<ReturnType<UsersService["findAll"]>>;
	type NonArrayFindAllResult = Exclude<FindAllResult, unknown[]>;
	type PageResult = Extract<
		NonArrayFindAllResult,
		{ pagination: { mode: "page" } }
	>;
	type CursorResult = Extract<
		NonArrayFindAllResult,
		{ pagination: { mode: "cursor" } }
	>;

	const expectUsersArray = (result: FindAllResult) => {
		expect(Array.isArray(result)).toBe(true);
		if (!Array.isArray(result)) {
			throw new TypeError("Expected users array result");
		}

		return result;
	};

	const expectPageResult = (result: FindAllResult): PageResult => {
		expect(Array.isArray(result)).toBe(false);
		if (Array.isArray(result) || result.pagination.mode !== "page") {
			throw new TypeError("Expected page pagination result");
		}

		return result as PageResult;
	};

	const expectCursorResult = (result: FindAllResult): CursorResult => {
		expect(Array.isArray(result)).toBe(false);
		if (Array.isArray(result) || result.pagination.mode !== "cursor") {
			throw new TypeError("Expected cursor pagination result");
		}

		return result as CursorResult;
	};

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [UsersService, DatabaseService],
		}).compile();

		process.env.DATABASE_PATH = ":memory:";
		service = module.get(UsersService);

		const db = module.get(DatabaseService);
		db.onModuleInit();

		db.run(
			"INSERT INTO users (name, email, phone, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				"Alice Johnson",
				"alice@example.com",
				"555-1001",
				"admin",
				1,
				"2024-01-10 00:00:00",
				"2024-01-10 00:00:00",
			],
		);
		db.run(
			"INSERT INTO users (name, email, phone, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				"Bob Stone",
				"bob@example.com",
				null,
				"customer",
				1,
				"2024-02-15 00:00:00",
				"2024-02-15 00:00:00",
			],
		);
		db.run(
			"INSERT INTO users (name, email, phone, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				"Carla Reed",
				"carla@example.com",
				"555-1003",
				"customer",
				0,
				"2024-03-20 00:00:00",
				"2024-03-20 00:00:00",
			],
		);
	});

	describe("findAll", () => {
		it("should return users sorted by id asc by default", async () => {
			const users = expectUsersArray(await service.findAll());
			expect(users.map((user) => user.email)).toEqual([
				"alice@example.com",
				"bob@example.com",
				"carla@example.com",
			]);
		});

		it("should filter by roles", async () => {
			const users = expectUsersArray(
				await service.findAll({
					roles: ["admin"],
				}),
			);

			expect(users).toHaveLength(1);
			expect(users[0]?.email).toBe("alice@example.com");
		});

		it("should filter by active state", async () => {
			const users = expectUsersArray(
				await service.findAll({
					isActive: false,
				}),
			);

			expect(users).toHaveLength(1);
			expect(users[0]?.email).toBe("carla@example.com");
		});

		it("should search users by name, email, and phone", async () => {
			const byName = expectUsersArray(
				await service.findAll({
					search: "Alice",
				}),
			);
			const byEmail = expectUsersArray(
				await service.findAll({
					search: "bob@example.com",
				}),
			);
			const byPhone = expectUsersArray(
				await service.findAll({
					search: "555-1003",
				}),
			);

			expect(byName.map((user) => user.email)).toEqual(["alice@example.com"]);
			expect(byEmail.map((user) => user.email)).toEqual(["bob@example.com"]);
			expect(byPhone.map((user) => user.email)).toEqual(["carla@example.com"]);
		});

		it("should filter by created_at range", async () => {
			const users = expectUsersArray(
				await service.findAll({
					createdAfter: "2024-02-01 00:00:00",
					createdBefore: "2024-03-01 00:00:00",
				}),
			);

			expect(users).toHaveLength(1);
			expect(users[0]?.email).toBe("bob@example.com");
		});

		it("should apply sort allowlist", async () => {
			const users = expectUsersArray(
				await service.findAll({
					sortBy: "name",
					sortDir: "desc",
				}),
			);

			expect(users.map((user) => user.name)).toEqual([
				"Carla Reed",
				"Bob Stone",
				"Alice Johnson",
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
			expect(result.items[0]?.email).toBe("bob@example.com");
		});

		it("should return cursor-based pagination metadata", async () => {
			const firstPage = expectCursorResult(
				await service.findAll({
					pagination: "cursor",
					limit: 2,
				}),
			);

			expect(firstPage.items.map((user) => user.email)).toEqual([
				"alice@example.com",
				"bob@example.com",
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

			expect(secondPage.items.map((user) => user.email)).toEqual([
				"carla@example.com",
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
		it("should return a user by id", async () => {
			const users = expectUsersArray(await service.findAll());
			const user = await service.findById(users[0]?.id ?? 0);
			expect(user?.email).toBe("alice@example.com");
		});
	});

	describe("create", () => {
		it("should create and return a new user", async () => {
			const user = await service.create({
				name: "New User",
				email: "new@example.com",
				phone: "555-9999",
			});

			expect(user?.name).toBe("New User");
			expect(user?.email).toBe("new@example.com");
			expect(user?.phone).toBe("555-9999");
		});

		it("should throw ConflictException when the email already exists", async () => {
			await expect(
				service.create({
					name: "Duplicate User",
					email: "alice@example.com",
				}),
			).rejects.toBeInstanceOf(ConflictException);
		});
	});
});
