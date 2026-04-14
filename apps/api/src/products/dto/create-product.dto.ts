import {
	type CreateProductInput,
	createProductInputSchema,
} from "@zapp/entities";

export const createProductDtoSchema = createProductInputSchema;
export type CreateProductDto = CreateProductInput;
