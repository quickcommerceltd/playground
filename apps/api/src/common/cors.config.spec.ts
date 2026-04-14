import { describe, expect, it } from "vitest";
import { createCorsOptions, resolveCorsOrigins } from "./cors.config";

describe("cors.config", () => {
	it("returns the local demo defaults when env is empty", () => {
		expect(resolveCorsOrigins("")).toEqual([
			"http://localhost:4991",
			"http://127.0.0.1:4991",
			"http://localhost:4994",
			"http://127.0.0.1:4994",
			"http://localhost:8081",
			"http://127.0.0.1:8081",
		]);
	});

	it("returns the local demo defaults when env is whitespace-only", () => {
		expect(resolveCorsOrigins("   ")).toEqual([
			"http://localhost:4991",
			"http://127.0.0.1:4991",
			"http://localhost:4994",
			"http://127.0.0.1:4994",
			"http://localhost:8081",
			"http://127.0.0.1:8081",
		]);
	});

	it("parses a comma-separated env override", () => {
		expect(
			resolveCorsOrigins(
				"http://localhost:4991, https://reviewer.local ,http://127.0.0.1:4994",
			),
		).toEqual([
			"http://localhost:4991",
			"https://reviewer.local",
			"http://127.0.0.1:4994",
		]);
	});

	it("builds explicit CORS options for the allowed origins", () => {
		expect(
			createCorsOptions("http://localhost:4991,http://localhost:4994"),
		).toEqual({
			origin: ["http://localhost:4991", "http://localhost:4994"],
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type"],
			maxAge: 3600,
		});
	});
});
