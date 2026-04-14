import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UserList } from "./user-list";

vi.mock("@zapp/utils", () => ({
	formatDate: () => "Apr 14, 2026",
}));

const mockUser = {
	id: 1,
	name: "Test User",
	email: "test@example.com",
	phone: "555-555-0101",
	role: "admin",
	is_active: 1,
	created_at: "2026-04-14T00:00:00.000Z",
};

describe("UserList", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders empty state when there are no users", () => {
		render(<UserList users={[]} />);
		expect(screen.getByText("No users found.")).toBeDefined();
	});

	it("renders users when provided via props", () => {
		render(<UserList users={[mockUser]} />);
		expect(screen.getByText("Test User")).toBeDefined();
		expect(screen.getByText("test@example.com")).toBeDefined();
		expect(screen.getByText("admin")).toBeDefined();
		expect(screen.getByText("Yes")).toBeDefined();
		expect(screen.getByText("Apr 14, 2026")).toBeDefined();
	});

	it("displays fallback for missing phone and inactive status", () => {
		render(
			<UserList
				users={[
					{
						...mockUser,
						id: 2,
						phone: null,
						is_active: 0,
					},
				]}
			/>,
		);
		expect(screen.getByText("No")).toBeDefined();
		expect(screen.getByText("—")).toBeDefined();
	});
});
