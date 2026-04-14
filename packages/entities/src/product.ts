import { z } from "zod";

export const productSchema = z.object({
	id: z.int(),
	name: z.string().min(1),
	description: z.string().nullable(),
	price: z.int(),
	sku: z.string().min(1),
	category: z.string().min(1),
	brand: z.string().nullable(),
	image_url: z.string().nullable(),
	thumbnail_url: z.string().nullable(),
	weight: z.number().nullable(),
	rating: z.number(),
	review_count: z.int(),
	in_stock: z.int(),
	stock_quantity: z.int(),
	discount_percent: z.int(),
	tags: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const createProductInputSchema = z.object({
	name: z.string().trim().min(1),
	description: z.string().trim().min(1).optional(),
	price: z.int().nonnegative(),
	sku: z.string().trim().min(1),
	category: z.string().trim().min(1),
	brand: z.string().trim().min(1).optional(),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
