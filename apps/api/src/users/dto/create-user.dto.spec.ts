import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { CreateUserDto } from "./create-user.dto";

const pipe = new ValidationPipe({
	whitelist: true,
	forbidNonWhitelisted: true,
	transform: true,
});

const metadata = {
	type: "body" as const,
	metatype: CreateUserDto,
	data: "",
};

const validBody = {
	name: "Ada Lovelace",
	email: "ada@example.com",
	phone: "+1-555-0100",
};

describe("CreateUserDto validation", () => {
	it("accepts a valid body", async () => {
		const result = await pipe.transform({ ...validBody }, metadata);
		expect(result).toBeInstanceOf(CreateUserDto);
		expect(result.email).toBe("ada@example.com");
	});

	it("accepts body without optional phone", async () => {
		const { phone, ...required } = validBody;
		const result = await pipe.transform(required, metadata);
		expect(result.phone).toBeUndefined();
	});

	it("rejects invalid email", async () => {
		await expect(
			pipe.transform({ ...validBody, email: "not-an-email" }, metadata),
		).rejects.toBeInstanceOf(BadRequestException);
	});

	it("rejects missing name", async () => {
		const { name, ...rest } = validBody;
		await expect(pipe.transform(rest, metadata)).rejects.toBeInstanceOf(
			BadRequestException,
		);
	});

	it("rejects unknown fields", async () => {
		await expect(
			pipe.transform({ ...validBody, role: "admin" }, metadata),
		).rejects.toBeInstanceOf(BadRequestException);
	});
});
