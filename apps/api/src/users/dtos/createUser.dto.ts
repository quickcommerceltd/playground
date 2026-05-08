import { Transform } from "@nestjs/class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsOptional } from "@nestjs/class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    name: string;
   
    @IsEmail()
    @Transform(({ value }) =>
      typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    email: string;
   
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    phone?: string;
  }