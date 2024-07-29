import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  adjectiveExpressionUserId1,
  adjectiveExpressionUserId2,
  defaultUrl,
} from './data';
import { UserUrlEntity } from '@infrastructure/user/database/entity/cud/user-url.entity';
import { UserEntity } from '@infrastructure/user/database/entity/cud/user.entity';
import { UserAdjectiveExpressionEntity } from '@infrastructure/game/database/entity/cud/user-adjective-expression.entity';

describe('AdjectiveExpressionController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    // main.ts에서 app에 주입시킨 사항들 추가.
    app = moduleFixture.createNestApplication();
    // app 실행
    await app.init();
    manager = app.get(getEntityManagerToken());
  });

  describe('GET /adjective-expression/list', () => {
    it('형용사 표현 리스트 출력', async () => {
      const response = await request(app.getHttpServer())
        .get('/adjective-expression/list')
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
    let url: UserUrlEntity;
    let userId: number;
    let submitUserId: number;

    beforeAll(async () => {
      url = await manager.save(UserUrlEntity, defaultUrl);
      userId = (
        await manager.save(UserEntity, {
          nickName: 'TEST_USER',
          imgId: 2,
          urlId: url.id,
          onboarding: true,
        })
      ).id;
      submitUserId = (
        await manager.save(UserEntity, {
          nickName: 'SUBMIT_USER',
          imgId: 2,
          urlId: url.id,
        })
      ).id;
    });

    it('밸런스 게임 투표', async () => {
      await request(app.getHttpServer())
        .post('/adjective-expression')
        .send({
          urlId: url.id,
          userId: userId,
          expressionIds: [1, 2, 3],
        })
        .expect(HttpStatus.CREATED);

      const find = await manager.find(UserAdjectiveExpressionEntity, {
        where: {
          userId: userId,
        },
      });

      expect(find.length).toBe(3);
    });

    it('형용사 표현 게임 동일한 유저가 2번 입력시 에러', async () => {
      await manager.save(UserAdjectiveExpressionEntity, {
        userId: submitUserId,
        adjectiveExpressionId: 1,
      });

      const response = await request(app.getHttpServer())
        .post('/adjective-expression')
        .send({
          urlId: url.id,
          userId: submitUserId,
          expressionIds: [1, 2, 3],
        });

      expect(response.body).toStrictEqual({
        code: 'USER_ADJECTIVE_EXPRESSION_SUBMIT',
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
      await manager.delete(UserUrlEntity, url.id);
    });
  });

  describe('GET /adjective-expression', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

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

      await manager.save(UserAdjectiveExpressionEntity, [
        {
          userId: userId1,
          adjectiveExpressionId: 1,
        },
        {
          userId: userId1,
          adjectiveExpressionId: 2,
        },
        {
          userId: userId1,
          adjectiveExpressionId: 16,
        },
        {
          userId: userId2,
          adjectiveExpressionId: 16,
        },
      ]);
    });

    it('해당 url에 있는 유저의 형용사 표현 출력', async () => {
      const resposne = await request(app.getHttpServer())
        .get('/adjective-expression')
        .query({
          urlId: urlId,
        })
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual([
        {
          expressions: ['꼼꼼한', '솔직한', '엉뚱한'],
          imgId: adjectiveExpressionUserId1.imgId,
          nickName: adjectiveExpressionUserId1.nickName,
          userId: expect.any(Number),
        },
        {
          expressions: ['엉뚱한'],
          imgId: adjectiveExpressionUserId2.imgId,
          nickName: adjectiveExpressionUserId2.nickName,
          userId: expect.any(Number),
        },
      ]);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
