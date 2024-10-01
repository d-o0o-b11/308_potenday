import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  balanceUser1List,
  balanceUser2List,
  balanceUser3List,
  balanceUserId1,
  balanceUserId2,
  balanceUserId3,
  defaultReadUrl,
  defaultUrl,
  noneSubmitBalanceUser,
  noneSubmitBalanceUserRead,
  submitBalanceUser,
  submitBalanceUserRead,
} from './data';
import { BALANCE_TYPES } from '@domain';
import {
  UrlReadEntity,
  UserBalanceEntity,
  UserEntity,
  UserReadEntity,
  UserUrlEntity,
} from '@infrastructure';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('BalanceController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;
  let readManager: EntityManager;

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
    readManager = app.get(getEntityManagerToken('read'));
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
    let urlId: number;
    let userId: number;
    let submitUserId: number;

    let urlReadId: string;
    let noneSubmitUserReadId: string;
    let submitUserReadId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId = (
        await manager.save(UserEntity, {
          ...noneSubmitBalanceUser,
          urlId,
        })
      ).id;
      submitUserId = (
        await manager.save(UserEntity, {
          ...submitBalanceUser,
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
            ...noneSubmitBalanceUserRead,
          },
        } as any)
      ).id;
      submitUserReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: submitUserId,
            urlId,
            ...submitBalanceUserRead,
          },
        } as any)
      ).id;
    });

    it('밸런스 게임 투표', async () => {
      const balanceData = {
        balanceId: 1,
        balanceType: BALANCE_TYPES.A,
      };
      await request(app.getHttpServer())
        .post('/balance')
        .send({
          urlId: urlId,
          userId: userId,
          balanceId: balanceData.balanceId,
          balanceType: balanceData.balanceType,
        })
        .expect(HttpStatus.CREATED);

      await sleep(500);

      const findOne = (await readManager.findOne(UserReadEntity, {
        where: {
          id: noneSubmitUserReadId,
        },
      })) as any;

      expect(findOne.data.balance).toEqual(
        expect.arrayContaining([
          expect.objectContaining(balanceData), // balanceData와 속성들이 일치하는 객체가 있는지 확인
        ]),
      );
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
          urlId: urlId,
          userId: submitUserId,
          balanceId: 1,
          balanceType: BALANCE_TYPES.B,
        });

      expect(response.body).toStrictEqual({
        code: 'SUBMIT_USER_BALANCE',
        status: 409,
        path: 'POST /balance',
        timestamp: expect.any(String),
        message: '이미 해당 라운드 밸런스 게임에 의견을 제출하였습니다.',
      });

      const findOne = (await readManager.findOne(UserReadEntity, {
        where: {
          id: submitUserReadId,
        },
      })) as any;

      expect(findOne.data.balance).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            balanceId: submitBalanceUserRead.balance[0].balanceId,
            balanceType: submitBalanceUserRead.balance[0].balanceType,
          }), // balanceData와 속성들이 일치하는 객체가 있는지 확인
        ]),
      );
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

  describe('GET /balance', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;
    let userId3: number;

    let urlReadId: string;
    let userReadId1: string;
    let userReadId2: string;
    let userReadId3: string;

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

      urlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...defaultReadUrl,
            urlId,
            userIdList: [userId1, userId2, userId3],
          },
        } as any)
      ).id;

      await manager.save(UserBalanceEntity, [
        {
          userId: userId1,
          balanceId: balanceUser1List[0].balanceId,
          balanceType: balanceUser1List[0].balanceType,
        },
        {
          userId: userId2,
          balanceId: balanceUser2List[0].balanceId,
          balanceType: balanceUser2List[0].balanceType,
        },
        {
          userId: userId1,
          balanceId: balanceUser1List[1].balanceId,
          balanceType: balanceUser1List[1].balanceType,
        },
        {
          userId: userId2,
          balanceId: balanceUser2List[1].balanceId,
          balanceType: balanceUser2List[1].balanceType,
        },
        {
          userId: userId3,
          balanceId: balanceUser3List[0].balanceId,
          balanceType: balanceUser3List[0].balanceType,
        },
      ]);

      userReadId1 = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId1,
            urlId,
            nickname: balanceUserId1.nickName,
            imgId: balanceUserId1.imgId,
            balance: balanceUser1List,
          },
        } as any)
      ).id;

      userReadId2 = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            nickname: balanceUserId2.nickName,
            imgId: balanceUserId2.imgId,
            balance: balanceUser2List,
          },
        } as any)
      ).id;

      userReadId3 = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId3,
            urlId,
            nickname: balanceUserId3.nickName,
            imgId: balanceUserId3.imgId,
            balance: balanceUser3List,
          },
        } as any)
      ).id;
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
      const response = await request(app.getHttpServer())
        .get('/balance')
        .query({
          urlId: urlId,
          balanceId: 2,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual([
        {
          balanceType: '브레인 팀에서 숨쉬듯 자괴감 느끼기',
          percent: '33%',
          users: [
            {
              id: userId1,
              imgId: balanceUserId1.imgId,
              nickName: balanceUserId1.nickName,
            },
          ],
        },
        {
          balanceType: '내가 팀 내 유일한 희망되기',
          percent: '66%',
          users: [
            {
              id: userId2,
              imgId: balanceUserId2.imgId,
              nickName: balanceUserId2.nickName,
            },
            {
              id: userId3,
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
      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, userReadId1);
      await readManager.delete(UserReadEntity, userReadId2);
      await readManager.delete(UserReadEntity, userReadId3);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
