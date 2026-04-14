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
import { type CreateUserDto, createUserDtoSchema } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

/**
 * V1 Users Controller - frozen legacy contract.
 *
 * Keep find-all as a flat array for existing clients.
 */
@Controller({ path: "users", version: "1" })
export class UsersV1Controller {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	async findById(@Param("id", ParseIntPipe) id: number) {
		const user = await this.usersService.findById(id);
		if (!user) {
			throw new NotFoundException(`User ${id} was not found.`);
		}

		return user;
	}

	@Post()
	create(
		@Body(new ZodValidationPipe(createUserDtoSchema)) body: CreateUserDto,
	) {
		return this.usersService.create(body);
	}
}
