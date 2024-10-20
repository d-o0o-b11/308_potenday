import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

export class SetUpConfig {
  constructor(private readonly app: NestExpressApplication) {}

  async setUp() {
    this.swaggerConfig();
    this.setCORS();
  }

  async setListen() {
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
      .addCookieAuth('potenday_token', {
        description:
          '쿠키를 통해 인증합니다. 로그인 후 JWT 토큰이 이 쿠키에 저장됩니다. 이후 API 호출 시 이 쿠키를 사용해 인증할 수 있습니다.',
        type: 'http',
      })
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
    this.app.use(cookieParser());
  }
}
