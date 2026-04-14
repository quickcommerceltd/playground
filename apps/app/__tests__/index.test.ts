import { formatCurrency } from "@zapp/utils";
import { describe, expect, it } from "vitest";

describe("App utils integration", () => {
	it("can use shared utils package", () => {
		expect(formatCurrency(1999)).toBe("$19.99");
	});
});
