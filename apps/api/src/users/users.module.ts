import { Module } from "@nestjs/common";
import { UsersV2Controller } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersV1Controller } from "./users-v1.controller";

@Module({
	controllers: [UsersV1Controller, UsersV2Controller],
	providers: [UsersService],
})
export class UsersModule {}
