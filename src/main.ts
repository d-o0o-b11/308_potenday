import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetUpConfig } from './config/config/setup.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = new SetUpConfig(app);
  await configService.setUp();
  await configService.setListen(3000);
}
bootstrap();
