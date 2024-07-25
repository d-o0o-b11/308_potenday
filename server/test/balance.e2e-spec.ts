import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  balanceUserId1,
  balanceUserId2,
  balanceUserId3,
  defaultUrl,
} from './data';
import { UserUrlEntity } from '@infrastructure/user/database/entity/user-url.entity';
import { UserEntity } from '@infrastructure/user/database/entity/user.entity';
import { BALANCE_TYPES } from '@domain';
import { UserBalanceEntity } from '@infrastructure/game/database/entity/user-balance.entity';

describe('BalanceController (e2e)', () => {
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

  describe('GET /balance/list', () => {
    const testCases = [
      {
        balanceId: 1,
        expectedResponse: {
          id: 1,
          typeA: '불편한 상사랑 점심마다 소고기',
          typeB: '짱 편한 동료랑 점심마다 컵라면 종류 고정',
        },
      },
      {
        balanceId: 2,
        expectedResponse: {
          id: 2,
          typeA: '브레인 팀에서 숨쉬듯 자괴감 느끼기',
          typeB: '내가 팀 내 유일한 희망되기',
        },
      },
      {
        balanceId: 3,
        expectedResponse: {
          id: 3,
          typeA: '연봉 2500 / 5시 칼퇴 / 퇴근 후 자유',
          typeB: '연봉 6000 / 9시 야근 / 퇴근 후 연락',
        },
      },
      {
        balanceId: 4,
        expectedResponse: {
          id: 4,
          typeA:
            '피 땀 눈물 흘려 완성한 제안서 사이 안 좋은 상사가 자기 이름으로 내기',
          typeB:
            '피 땀 눈물 흘려 완성한 제안서 저장 전 컴퓨터 꺼져서 날리기(복구 안됨)',
        },
      },
    ];

    testCases.forEach(({ balanceId, expectedResponse }) => {
      it(`밸런스 게임 질문지 출력 (balanceId: ${balanceId})`, async () => {
        const response = await request(app.getHttpServer())
          .get('/balance/list')
          .query({ balanceId })
          .expect(HttpStatus.OK);

        expect(response.body).toStrictEqual(expectedResponse);
      });
    });
  });

  describe('POST /balance', () => {
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
        .post('/balance')
        .send({
          urlId: url.id,
          userId: userId,
          balanceId: 1,
          balanceType: BALANCE_TYPES.A,
        })
        .expect(HttpStatus.CREATED);

      const find = await manager.findOne(UserBalanceEntity, {
        where: {
          userId: userId,
          balanceId: 1,
        },
      });

      expect(find).not.toBeNull();
    });

    it('밸런스 게임 투표 동일한 유저가 2번 이상 투표할 경우 에러', async () => {
      await manager.save(UserBalanceEntity, {
        userId: submitUserId,
        balanceId: 1,
        balanceType: BALANCE_TYPES.B,
      });

      const response = await request(app.getHttpServer())
        .post('/balance')
        .send({
          urlId: url.id,
          userId: submitUserId,
          balanceId: 1,
          balanceType: BALANCE_TYPES.A,
        });

      expect(response.body).toStrictEqual({
        code: 'USER_BALANCE_SUBMIT',
        status: 409,
        path: 'POST /balance',
        timestamp: expect.any(String),
        message: '이미 해당 라운드 밸런스 게임에 의견을 제출하였습니다.',
      });

      const find = await manager.find(UserBalanceEntity, {
        where: {
          userId: submitUserId,
          balanceId: 1,
        },
      });

      expect(find.length).toStrictEqual(1);
    });

    it('다음 라운드 밸런스 게임 투표 저장', async () => {
      await request(app.getHttpServer())
        .post('/balance')
        .send({
          urlId: url.id,
          userId: userId,
          balanceId: 2,
          balanceType: BALANCE_TYPES.B,
        })
        .expect(HttpStatus.CREATED);

      const find = await manager.findOne(UserBalanceEntity, {
        where: {
          userId: userId,
          balanceId: 2,
        },
      });

      expect(find).not.toBeNull();
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId);
      await manager.delete(UserEntity, submitUserId);
      await manager.delete(UserUrlEntity, url.id);
    });
  });

  describe('GET /balance', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;
    let userId3: number;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId1 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...balanceUserId1,
        })
      ).id;

      userId2 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...balanceUserId2,
        })
      ).id;

      userId3 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...balanceUserId3,
        })
      ).id;

      await manager.save(UserBalanceEntity, [
        {
          userId: userId1,
          balanceId: 1,
          balanceType: BALANCE_TYPES.A,
        },
        {
          userId: userId2,
          balanceId: 1,
          balanceType: BALANCE_TYPES.A,
        },
        {
          userId: userId1,
          balanceId: 2,
          balanceType: BALANCE_TYPES.A,
        },
        {
          userId: userId2,
          balanceId: 2,
          balanceType: BALANCE_TYPES.A,
        },
        {
          userId: userId3,
          balanceId: 2,
          balanceType: BALANCE_TYPES.B,
        },
      ]);
    });

    it('각 밸런스 게임 결과 보기 (100%)', async () => {
      const resposne = await request(app.getHttpServer())
        .get('/balance')
        .query({
          urlId: urlId,
          balanceId: 1,
        })
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual([
        {
          balanceType: '불편한 상사랑 점심마다 소고기',
          percent: '100%',
          users: [
            {
              id: expect.any(Number),
              imgId: balanceUserId1.imgId,
              nickName: balanceUserId1.nickName,
            },
            {
              id: expect.any(Number),
              imgId: balanceUserId2.imgId,
              nickName: balanceUserId2.nickName,
            },
          ],
        },
      ]);
    });

    it('각 밸런스 게임 결과 보기 (66% : 33%)', async () => {
      const resposne = await request(app.getHttpServer())
        .get('/balance')
        .query({
          urlId: urlId,
          balanceId: 2,
        })
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual([
        {
          balanceType: '브레인 팀에서 숨쉬듯 자괴감 느끼기',
          percent: '66%',
          users: [
            {
              id: expect.any(Number),
              imgId: balanceUserId1.imgId,
              nickName: balanceUserId1.nickName,
            },
            {
              id: expect.any(Number),
              imgId: balanceUserId2.imgId,
              nickName: balanceUserId2.nickName,
            },
          ],
        },
        {
          balanceType: '내가 팀 내 유일한 희망되기',
          percent: '33%',
          users: [
            {
              id: expect.any(Number),
              imgId: balanceUserId3.imgId,
              nickName: balanceUserId3.nickName,
            },
          ],
        },
      ]);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserEntity, userId3);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
