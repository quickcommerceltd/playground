import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	Min,
} from "class-validator";

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name!: string;

	@IsOptional()
	@IsString()
	@MaxLength(2000)
	description?: string;

	@IsInt()
	@Min(0)
	price!: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(64)
	sku!: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(64)
	category!: string;

	@IsOptional()
	@IsString()
	@MaxLength(128)
	brand?: string;
}
