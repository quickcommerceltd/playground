import {
	Body,
	Controller,
	Get,
	Inject,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
	type CreateProductDto,
	createProductDtoSchema,
} from "./dto/create-product.dto";
import {
	type FindProductsQueryDto,
	findProductsQueryDtoSchema,
	mapFindProductsQueryToFilters,
} from "./dto/find-products-query.dto";
import { ProductsService } from "./products.service";

@Controller({ path: "products", version: "2" })
export class ProductsV2Controller {
	constructor(
		@Inject(ProductsService)
		private readonly productsService: ProductsService,
	) {}

	@Get()
	findAll(
		@Query(new ZodValidationPipe(findProductsQueryDtoSchema))
		query: FindProductsQueryDto = {},
	) {
		return this.productsService.findAll(mapFindProductsQueryToFilters(query));
	}

	@Get("brands")
	findBrands() {
		return this.productsService.findBrands();
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

export { ProductsV2Controller as ProductsController };
