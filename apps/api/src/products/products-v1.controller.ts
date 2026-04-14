import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
} from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
	type CreateProductDto,
	createProductDtoSchema,
} from "./dto/create-product.dto";
import { ProductsService } from "./products.service";

/**
 * V1 Products Controller — frozen legacy contract.
 *
 * GET /products and GET /v1/products resolve here (v1 is the default version).
 * Old mobile clients that haven't updated rely on this returning a flat array.
 *
 * Do NOT add filters, pagination, or change the response shape.
 */
@Controller({ path: "products", version: "1" })
export class ProductsV1Controller {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(":id")
	async findById(@Param("id", ParseIntPipe) id: number) {
		const product = await this.productsService.findById(id);
		if (!product) {
			throw new NotFoundException(`Product ${id} was not found.`);
		}

		return product;
	}

	@Post()
	create(
		@Body(new ZodValidationPipe(createProductDtoSchema)) body: CreateProductDto,
	) {
		return this.productsService.create(body);
	}
}
