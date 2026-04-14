import "reflect-metadata";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createCorsOptions } from "./common/cors.config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors(createCorsOptions());
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});
	const port = process.env.PORT || 4992;
	await app.listen(port);
	console.log(`API running on http://localhost:${port}`);
}

bootstrap();
