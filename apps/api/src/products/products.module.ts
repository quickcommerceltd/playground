import { Module } from "@nestjs/common";
import { ProductsV2Controller } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsV1Controller } from "./products-v1.controller";

@Module({
	controllers: [ProductsV1Controller, ProductsV2Controller],
	providers: [ProductsService],
})
export class ProductsModule {}
