import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { CreateProductDto } from "./create-product.dto";

const pipe = new ValidationPipe({
	whitelist: true,
	forbidNonWhitelisted: true,
	transform: true,
});

const metadata = {
	type: "body" as const,
	metatype: CreateProductDto,
	data: "",
};

const validBody = {
	name: "Widget",
	description: "A useful widget",
	price: 1999,
	sku: "WDG-001",
	category: "tools",
	brand: "Acme",
};

describe("CreateProductDto validation", () => {
	it("accepts a valid body", async () => {
		const result = await pipe.transform({ ...validBody }, metadata);
		expect(result).toBeInstanceOf(CreateProductDto);
		expect(result.name).toBe("Widget");
	});

	it("accepts a valid body without optional fields", async () => {
		const { description, brand, ...required } = validBody;
		const result = await pipe.transform(required, metadata);
		expect(result.description).toBeUndefined();
		expect(result.brand).toBeUndefined();
	});

	it("rejects missing required field", async () => {
		const { name, ...rest } = validBody;
		await expect(pipe.transform(rest, metadata)).rejects.toBeInstanceOf(
			BadRequestException,
		);
	});

	it("rejects non-integer price", async () => {
		await expect(
			pipe.transform({ ...validBody, price: "abc" }, metadata),
		).rejects.toBeInstanceOf(BadRequestException);
	});

	it("rejects negative price", async () => {
		await expect(
			pipe.transform({ ...validBody, price: -1 }, metadata),
		).rejects.toBeInstanceOf(BadRequestException);
	});

	it("rejects unknown fields", async () => {
		await expect(
			pipe.transform({ ...validBody, hacked: true }, metadata),
		).rejects.toBeInstanceOf(BadRequestException);
	});

	it("rejects empty name", async () => {
		await expect(
			pipe.transform({ ...validBody, name: "" }, metadata),
		).rejects.toBeInstanceOf(BadRequestException);
	});
});
