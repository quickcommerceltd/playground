import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name!: string;

	@IsEmail()
	@MaxLength(255)
	email!: string;

	@IsOptional()
	@IsString()
	@MaxLength(32)
	phone?: string;
}
