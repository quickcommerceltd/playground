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
import { type CreateUserDto, createUserDtoSchema } from "./dto/create-user.dto";
import {
	type FindUsersQueryDto,
	findUsersQueryDtoSchema,
	mapFindUsersQueryToFilters,
} from "./dto/find-users-query.dto";
import { UsersService } from "./users.service";

@Controller({ path: "users", version: "2" })
export class UsersV2Controller {
	constructor(
		@Inject(UsersService)
		private readonly usersService: UsersService,
	) {}

	@Get()
	findAll(
		@Query(new ZodValidationPipe(findUsersQueryDtoSchema))
		query: FindUsersQueryDto = {},
	) {
		return this.usersService.findAll(mapFindUsersQueryToFilters(query));
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
