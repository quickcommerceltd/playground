import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
  } from '@nestjs/class-validator';
  import { Transform, Type } from '@nestjs/class-transformer';
  

  export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;
  
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) =>
      typeof value === 'string' ? value.trim().toUpperCase() : value,
    )
    sku: string;
  
    @IsString()
    @IsNotEmpty()
    category: string;
  
    @IsOptional()
    @IsString()
    brand?: string;
  }