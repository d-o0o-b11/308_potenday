import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager, JsonContains } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import { defaultReadUrl, defaultUrl } from './data';
import { EventEntity, UrlReadEntity, UserUrlEntity } from '@infrastructure';
import { TestTokenService } from './test-cookie.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@application';
import { TestJwtAuthGuard } from './auth-test.guard';
import * as cookieParser from 'cookie-parser';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('CommonQuestionController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;
  let readManager: EntityManager;
  let testTokenService: TestTokenService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('jwt.secretKey'),
            signOptions: {
              expiresIn: configService.get('jwt.secretKeyExpire'),
            },
          }),
        }),
      ],
      providers: [TestTokenService],
    })
      .overrideGuard(JwtAuthGuard)
      .useFactory({
        factory: (jwtService: JwtService) => new TestJwtAuthGuard(jwtService),
        inject: [JwtService],
      })
      .compile();

    // main.ts에서 app에 주입시킨 사항들 추가.
    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    // app 실행
    await app.init();
    testTokenService = app.get(TestTokenService);
    manager = app.get(getEntityManagerToken());
    readManager = app.get(getEntityManagerToken('read'));
  });

  describe('POST /common-question/next', () => {
    let urlId: number;
    let urlReadId: string;
    let eventLogId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      urlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...defaultReadUrl,
            urlId,
          },
        } as any)
      ).id;
    });

    it('공통 질문 다음으로 넘어가기 버튼 클릭합니다.', async () => {
      const token = testTokenService.generateToken({
        urlId: urlId,
        userId: 999999,
      });

      await request(app.getHttpServer())
        .post('/common-question/next')
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.CREATED);

      const eventLog = await manager.findOne(EventEntity, {
        where: {
          type: 'CommonQuestionGameNextEvent',
          event: JsonContains({ urlId }),
        },
      });
      eventLogId = eventLog.id;
      expect(eventLog).not.toBeNull();
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await manager.delete(EventEntity, eventLogId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
