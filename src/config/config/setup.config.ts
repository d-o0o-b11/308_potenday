import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export class SetUpConfig {
  constructor(private readonly app: NestExpressApplication) {}

  async setUp() {
    this.swaggerConfig();
    this.setCORS();
  }

  async setListen(port: number) {
    await this.app.listen(port);
  }

  protected swaggerConfig() {
    const config = new DocumentBuilder()
      .setTitle('POTEN_DAY SWAGGER')
      .setDescription('poten day API description')
      .setVersion('3.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          name: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const swaggerOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        tagsSorter: 'alpha',
        syntaxHighlight: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
      },
    };

    const document = SwaggerModule.createDocument(this.app, config);

    SwaggerModule.setup(
      'swagger/potenday308',
      this.app,
      document,
      swaggerOptions,
    );
  }

  protected setCORS() {
    // this.app.enableCors({
    //   origin: ['http://localhost:3000', 'http://localhost:5173'],
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    //   credentials: true,
    //   allowedHeaders: 'Content-Type, Accept, Authorization',
    // });
    this.app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
  }
}
