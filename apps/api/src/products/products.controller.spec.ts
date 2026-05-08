import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

describe("ProductsController (validation)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [ProductsService],
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

	describe("POST /products", () => {


		describe('DTO validations', ()=>{
			it("uppercases the SKU before persisting (case-insensitive input)", async () => {
				const response = await request(app.getHttpServer())
					.post("/products")
					.send({
						name: "Wireless Mouse",
						price: 29.99,
						sku: "  abc-123  ",
						category: "Accessories",
					})
					.expect(201);
	
				expect(response.body.sku).toBe("ABC-123");
				expect(response.body.name).toBe("Wireless Mouse");
			});
	
			it("rejects a missing name with 400", async () => {
				const response = await request(app.getHttpServer())
					.post("/products")
					.send({
						price: 29.99,
						sku: "ABC-123",
						category: "Accessories",
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
	
			it("rejects an empty name with 400", async () => {
				const response = await request(app.getHttpServer())
					.post("/products")
					.send({
						name: "",
						price: 29.99,
						sku: "ABC-123",
						category: "Accessories",
					})
					.expect(400);
	
				expect(response.body.message).toEqual(
					expect.arrayContaining([
						expect.stringContaining("name should not be empty"),
					]),
				);
			});
	
			it("rejects a missing category with 400", async () => {
				const response = await request(app.getHttpServer())
					.post("/products")
					.send({
						name: "Wireless Mouse",
						price: 29.99,
						sku: "ABC-123",
					})
					.expect(400);
	
				expect(response.body.message).toEqual(
					expect.arrayContaining([
						expect.stringContaining("category should not be empty"),
					]),
				);
			});
	
			it("rejects an empty category with 400", async () => {
				const response = await request(app.getHttpServer())
					.post("/products")
					.send({
						name: "Wireless Mouse",
						price: 29.99,
						sku: "ABC-123",
						category: "",
					})
					.expect(400);
	
				expect(response.body.message).toEqual(
					expect.arrayContaining([
						expect.stringContaining("category should not be empty"),
					]),
				);
			});
	
			it("accepts a fully valid product and echoes optional fields back", async () => {
				const response = await request(app.getHttpServer())
					.post("/products")
					.send({
						name: "Wireless Mouse",
						description: "Bluetooth, 2.4GHz",
						price: 29.99,
						sku: "abc-123",
						category: "Accessories",
						brand: "Logitech",
					})
					.expect(201);
	
				expect(response.body).toMatchObject({
					name: "Wireless Mouse",
					description: "Bluetooth, 2.4GHz",
					price: 29.99,
					sku: "ABC-123",
					category: "Accessories",
					brand: "Logitech",
				});
			});
		})
	
	});
});