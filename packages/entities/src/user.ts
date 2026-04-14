import { z } from "zod";

export const userSchema = z.object({
	id: z.int(),
	name: z.string().min(1),
	email: z.email(),
	phone: z.string().nullable(),
	avatar_url: z.string().nullable(),
	role: z.string(),
	is_active: z.int(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const createUserInputSchema = z.object({
	name: z.string().trim().min(1),
	email: z.email(),
	phone: z.string().trim().min(1).optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
