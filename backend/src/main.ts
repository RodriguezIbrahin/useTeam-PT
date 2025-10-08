import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const FRONTEND = process.env.FRONTEND_URL || "*"; // idealmente setear en .env
  app.enableCors({
    origin: FRONTEND === "*" ? true : FRONTEND,
    credentials: true,
  });
  app.setGlobalPrefix("api"); // dejamos global prefix 'api'
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
