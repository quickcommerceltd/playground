import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dtos/createProduct.dto";

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(":id")
	findById(@Param("id", ParseIntPipe) id: string) {
		return this.productsService.findById(Number(id));
	}

	@Post()
	create(
		@Body()
		body: CreateProductDto
	) {
		return this.productsService.create(body);
	}
}
