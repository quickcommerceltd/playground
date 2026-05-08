import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ProductsService } from "./products.service";

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
		body: {
			name: string;
			description?: string;
			price: number;
			sku: string;
			category: string;
			brand?: string;
		},
	) {
		return this.productsService.create(body);
	}
}
