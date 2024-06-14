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
    await this.app.listen(process.env.SERVER_PORT || 3000, '0.0.0.0');
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
    this.app.enableCors({
      origin: ['https://melting-point.vercel.app/*'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
  }
}
