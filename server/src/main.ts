import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SetUpConfig } from './config/config/setup.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { SetUpConfig } from '@config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = new SetUpConfig(app);
  await configService.setUp();
  await configService.setListen();

  //   Logger.log(
  //     `
  //         __________  ________   __
  //         / /  _/  |/  /  _/ | / /
  //    __  / // // /|_/ // //  |/ /
  //   / /_/ // // /  / // // /|  /
  //   \____/___/_/  /_/___/_/ |_/

  // Nest.js is running on Port [${
  //       process.env.SERVER_PORT || 3000
  //     }], using ENV mode [${process.env.NODE_ENV}]`,
  //   );
}
bootstrap();
