import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController (validation)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		}).compile();

		app = module.createNestApplication();
		// Mirror what main.ts does so transforms + validators actually run
		app.useGlobalPipes(
			new ValidationPipe({ transform: true, whitelist: true }),
		);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	describe("POST /users", () => {

		describe('DTO validations', ()=>{
			it("normalizes a messy email (uppercase + trailing whitespace) before persisting", async () => {
				const response = await request(app.getHttpServer())
					.post("/users")
					.send({
						name: "Alice",
						email: "  ALICE@Example.COM  ",
					})
					.expect(201);
	
				// The created user comes back with the cleaned email
				expect(response.body.email).toBe("alice@example.com");
				expect(response.body.name).toBe("Alice");
			});
	
			it("rejects an empty name with 400 and a useful message", async () => {
				const response = await request(app.getHttpServer())
					.post("/users")
					.send({
						name: "",
						email: "alice@example.com",
					})
					.expect(400);
	
				expect(response.body).toMatchObject({
					statusCode: 400,
					error: "Bad Request",
				});
				expect(response.body.message).toEqual(
					expect.arrayContaining([
						expect.stringContaining("name should not be empty"),
					]),
				);
			});
	
			it("rejects a non-UK phone number (US format) with 400", async () => {
				const response = await request(app.getHttpServer())
					.post("/users")
					.send({
						name: "Alice",
						email: "alice@example.com",
						phone: "+15551234567",
					})
					.expect(400);
	
				expect(response.body.message).toEqual(
					expect.arrayContaining([
						expect.stringContaining("phone must be a valid UK phone number"),
					]),
				);
			});
	
			it("rejects a phone number missing the leading + sign with 400", async () => {
				const response = await request(app.getHttpServer())
					.post("/users")
					.send({
						name: "Alice",
						email: "alice@example.com",
						phone: "447911123456", // would be valid as +447911123456
					})
					.expect(400);
	
				expect(response.body.message).toEqual(
					expect.arrayContaining([
						expect.stringContaining("phone must be a valid UK phone number"),
					]),
				);
			});
	
			it("accepts a properly formatted UK phone number", async () => {
				const response = await request(app.getHttpServer())
					.post("/users")
					.send({
						name: "Alice",
						email: "alice@example.com",
						phone: "+447911123456",
					})
					.expect(201);
	
				expect(response.body).toMatchObject({
					name: "Alice",
					email: "alice@example.com",
					phone: "+447911123456",
				});
			});
		})
		
	});
});