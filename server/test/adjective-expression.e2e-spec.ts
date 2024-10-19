import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  adjectiveExpressionUserId1,
  adjectiveExpressionUserId1Read,
  adjectiveExpressionUserId2,
  adjectiveExpressionUserId2Read,
  defaultReadUrl,
  defaultUrl,
  noneSubmitAdjectiveUser,
  noneSubmitAdjectiveUserRead,
  submitAdjectiveUser,
  submitAdjectiveUserRead,
} from './data';
import {
  UrlReadEntity,
  UserAdjectiveExpressionEntity,
  UserEntity,
  UserReadEntity,
  UserUrlEntity,
} from '@infrastructure';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestTokenService } from './test-cookie.service';
import { JwtAuthGuard } from '@application';
import { TestJwtAuthGuard } from './auth-test.guard';
import * as cookieParser from 'cookie-parser';

describe('AdjectiveExpressionController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;
  let readManager: EntityManager;
  let testTokenService: TestTokenService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: process.env.JWT_SECRET_KEY_EXPIRE },
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

  describe('GET /adjective-expression/list', () => {
    it('형용사 표현 리스트 출력', async () => {
      const token = testTokenService.generateToken({
        urlId: 999999,
        userId: 999999,
      });

      const response = await request(app.getHttpServer())
        .get('/adjective-expression/list')
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual([
        { adjective: '꼼꼼한', id: 1 },
        { adjective: '솔직한', id: 2 },
        { adjective: '자신감있는', id: 3 },
        { adjective: '사려깊은', id: 4 },
        { adjective: '신중한', id: 5 },
        { adjective: '쾌활한', id: 6 },
        { adjective: '침착한', id: 7 },
        { adjective: '내성적인', id: 8 },
        { adjective: '외향적인', id: 9 },
        { adjective: '긍정적인', id: 10 },
        { adjective: '열정적인', id: 11 },
        { adjective: '다정한', id: 12 },
        { adjective: '부지런한', id: 13 },
        { adjective: '정직한', id: 14 },
        { adjective: '즉흥적인', id: 15 },
        { adjective: '엉뚱한', id: 16 },
      ]);
    });
  });

  describe('POST /adjective-expression', () => {
    let urlId: number;
    let urlReadId: string;
    let userId: number;
    let submitUserId: number;
    let noneSubmitUserReadId: string;
    let submitUserReadId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId = (
        await manager.save(UserEntity, {
          ...noneSubmitAdjectiveUser,
          urlId,
        })
      ).id;
      submitUserId = (
        await manager.save(UserEntity, {
          ...submitAdjectiveUser,
          urlId,
        })
      ).id;

      urlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...defaultReadUrl,
            urlId,
            userIdList: [userId, submitUserId],
          },
        } as any)
      ).id;

      noneSubmitUserReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId,
            urlId,
            ...noneSubmitAdjectiveUserRead,
          },
        } as any)
      ).id;
      submitUserReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: submitUserId,
            urlId,
            ...submitAdjectiveUserRead,
          },
        } as any)
      ).id;
    });

    it('밸런스 게임 투표', async () => {
      const token = testTokenService.generateToken({
        urlId,
        userId,
      });

      await request(app.getHttpServer())
        .post('/adjective-expression')
        .send({
          urlId,
          userId,
          expressionIdList: [1, 2, 3],
        })
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.CREATED);

      const find = await manager.find(UserAdjectiveExpressionEntity, {
        where: {
          userId: userId,
        },
      });
      expect(find.length).toBe(3);

      const findRead: any = await readManager.findOne(UserReadEntity, {
        where: {
          id: noneSubmitUserReadId,
        },
      });
      expect(
        findRead.data.adjectiveExpression.adjectiveExpressionIdList,
      ).toStrictEqual([1, 2, 3]);
    });

    it('형용사 표현 게임 동일한 유저가 2번 입력시 에러', async () => {
      const token = testTokenService.generateToken({
        urlId,
        userId: submitUserId,
      });

      await manager.save(UserAdjectiveExpressionEntity, {
        userId: submitUserId,
        adjectiveExpressionId: 1,
      });

      const response = await request(app.getHttpServer())
        .post('/adjective-expression')
        .send({
          urlId,
          userId: submitUserId,
          expressionIdList: [1, 2, 3],
        })
        .set('Cookie', [`test_token=${token.token}`]);

      expect(response.body).toStrictEqual({
        code: 'SUBMIT_ADJECTIVE_EXPRESSION',
        status: 409,
        timestamp: expect.any(String),
        path: 'POST /adjective-expression',
        message: '이미 형용사 표현 값을 제출하였습니다.',
      });

      const find = await manager.find(UserAdjectiveExpressionEntity, {
        where: {
          userId: submitUserId,
        },
      });
      expect(find.length).toStrictEqual(1);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId);
      await manager.delete(UserEntity, submitUserId);
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, noneSubmitUserReadId);
      await readManager.delete(UserReadEntity, submitUserReadId);
    });
  });

  describe('GET /adjective-expression', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

    let urlReadId: string;
    let adjectiveExpressionUserIdRead1: string;
    let adjectiveExpressionUserIdRead2: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId1 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...adjectiveExpressionUserId1,
        })
      ).id;

      userId2 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...adjectiveExpressionUserId2,
        })
      ).id;

      urlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...defaultReadUrl,
            urlId,
            userIdList: [userId1, userId2],
          },
        } as any)
      ).id;

      adjectiveExpressionUserIdRead1 = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId1,
            urlId,
            ...adjectiveExpressionUserId1Read,
          },
        } as any)
      ).id;

      adjectiveExpressionUserIdRead2 = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            ...adjectiveExpressionUserId2Read,
          },
        } as any)
      ).id;
    });

    it('해당 url에 있는 유저의 형용사 표현 출력', async () => {
      const token = testTokenService.generateToken({
        urlId: urlId,
        userId: userId1,
      });

      const resposne = await request(app.getHttpServer())
        .get('/adjective-expression')
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual([
        {
          adjectiveExpressionList: ['열정적인'],
          imgId: adjectiveExpressionUserId1.imgId,
          name: adjectiveExpressionUserId1.name,
          userId: expect.any(Number),
        },
        {
          adjectiveExpressionList: ['꼼꼼한', '자신감있는', '열정적인'],
          imgId: adjectiveExpressionUserId2.imgId,
          name: adjectiveExpressionUserId2.name,
          userId: userId2,
        },
      ]);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, adjectiveExpressionUserIdRead1);
      await readManager.delete(UserReadEntity, adjectiveExpressionUserIdRead2);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
