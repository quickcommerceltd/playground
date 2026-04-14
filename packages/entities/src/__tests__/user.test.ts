import { describe, expect, it } from "vitest";
import { createUserInputSchema } from "../user";

describe("createUserInputSchema", () => {
	it("accepts valid user input", () => {
		const result = createUserInputSchema.safeParse({
			name: "Alice Johnson",
			email: "alice@example.com",
		});

		expect(result.success).toBe(true);
	});

	it("accepts optional phone", () => {
		const result = createUserInputSchema.safeParse({
			name: "Alice Johnson",
			email: "alice@example.com",
			phone: "+1-555-0101",
		});

		expect(result.success).toBe(true);
	});

	it("rejects empty name", () => {
		const result = createUserInputSchema.safeParse({
			name: "",
			email: "alice@example.com",
		});

		expect(result.success).toBe(false);
	});

	it("rejects invalid email", () => {
		const result = createUserInputSchema.safeParse({
			name: "Alice",
			email: "not-an-email",
		});

		expect(result.success).toBe(false);
	});

	it("rejects missing email", () => {
		const result = createUserInputSchema.safeParse({
			name: "Alice",
		});

		expect(result.success).toBe(false);
	});

	it("trims whitespace from string fields", () => {
		const result = createUserInputSchema.safeParse({
			name: "  Alice Johnson  ",
			email: "alice@example.com",
			phone: "  +1-555-0101  ",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("Alice Johnson");
			expect(result.data.phone).toBe("+1-555-0101");
		}
	});
});
