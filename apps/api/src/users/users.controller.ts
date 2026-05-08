import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/createUser.dto";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	findById(@Param("id", ParseIntPipe) id: string) {
		return this.usersService.findById(Number(id));
	}

	@Post()
	create(@Body() body: CreateUserDto) {
		return this.usersService.create(body);
	}
}
