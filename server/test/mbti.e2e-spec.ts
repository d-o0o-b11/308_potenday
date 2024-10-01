import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  mbtiUserId1,
  mbtiUserId2,
  defaultUrl,
  defaultReadUrl,
  mbtiSubmitUser,
  mbtiOtherUser,
} from './data';
import {
  UrlReadEntity,
  UserEntity,
  UserMbtiEntity,
  UserReadEntity,
  UserUrlEntity,
} from '@infrastructure';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('AdjectiveExpressionController (e2e)', () => {
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

  describe('GET /mbti', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

    let urlReadId: string;
    let mbtiUser1ReadId: string;
    let mbtiUser2ReadId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId1 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId1,
        })
      ).id;

      userId2 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId2,
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

      mbtiUser1ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId1,
            urlId,
            nickname: mbtiUserId1.nickName,
            imgId: mbtiUserId1.imgId,
            mbti: [
              {
                mbti: 'ISTJ',
                toUserId: userId1,
              },
              {
                mbti: 'ESTJ',
                toUserId: userId2,
              },
            ],
          },
        } as any)
      ).id;

      mbtiUser2ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            nickname: mbtiUserId2.nickName,
            imgId: mbtiUserId2.imgId,
            mbti: [
              {
                mbti: 'ISTP',
                toUserId: userId1,
              },
              {
                mbti: 'ESTP',
                toUserId: userId2,
              },
            ],
          },
        } as any)
      ).id;
    });

    const testMbtiEndpoint = async (
      roundId: number,
      expectedUser: any,
      userId: number,
    ) => {
      const response = await request(app.getHttpServer())
        .get('/mbti')
        .query({
          urlId: urlId,
          roundId: roundId,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        userId: userId,
        imgId: expectedUser.imgId,
        nickName: expectedUser.nickName,
      });
    };

    it('해당 라운드에 추측할 유저 정보 출력 (유저1)', async () => {
      sleep(500);
      await testMbtiEndpoint(1, mbtiUserId1, userId1);
    });

    it('해당 라운드에 추측할 유저 정보 출력 (유저2)', async () => {
      sleep(500);
      await testMbtiEndpoint(2, mbtiUserId2, userId2);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, mbtiUser1ReadId);
      await readManager.delete(UserReadEntity, mbtiUser2ReadId);
    });
  });

  describe('POST /mbti', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;
    let submitUserId: number;
    let otherUserId: number;

    let urlReadId: string;
    let mbtiUser1ReadId: string;
    let mbtiUser2ReadId: string;
    let mbtiSubmitUserReadId: string;
    let mbtiOtherUserReadId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId1 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId1,
        })
      ).id;

      userId2 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId2,
        })
      ).id;

      submitUserId = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiSubmitUser,
        })
      ).id;

      otherUserId = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiOtherUser,
        })
      ).id;

      urlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...defaultReadUrl,
            urlId,
            userIdList: [userId1, userId2, submitUserId, otherUserId],
          },
        } as any)
      ).id;

      mbtiUser1ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId1,
            urlId,
            nickname: mbtiUserId1.nickName,
            imgId: mbtiUserId1.imgId,
          },
        } as any)
      ).id;

      mbtiUser2ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            nickname: mbtiUserId2.nickName,
            imgId: mbtiUserId2.imgId,
          },
        } as any)
      ).id;

      mbtiSubmitUserReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: submitUserId,
            urlId,
            nickname: mbtiSubmitUser.nickName,
            imgId: mbtiSubmitUser.imgId,
            mbti: [
              {
                mbti: 'ISTJ',
                toUserId: submitUserId,
              },
            ],
          },
        } as any)
      ).id;

      mbtiOtherUserReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: otherUserId,
            urlId,
            nickname: mbtiOtherUser.nickName,
            imgId: mbtiOtherUser.imgId,
            mbti: [
              {
                mbti: 'ISTP',
                toUserId: submitUserId,
              },
            ],
          },
        } as any)
      ).id;
    });

    it('본인 mbti 저장', async () => {
      await request(app.getHttpServer())
        .post('/mbti')
        .send({
          urlId: urlId,
          userId: userId1,
          mbti: 'ISTJ',
          toUserId: userId1,
        })
        .expect(HttpStatus.CREATED);

      const find = await manager.findOne(UserMbtiEntity, {
        where: {
          userId: userId1,
          toUserId: userId1,
        },
      });

      expect(find.mbti).toStrictEqual('ISTJ');
    });

    it('다른 유저 mbti 추측값 저장', async () => {
      await request(app.getHttpServer())
        .post('/mbti')
        .send({
          urlId: urlId,
          userId: userId1,
          mbti: 'ISTP',
          toUserId: userId2,
        })
        .expect(HttpStatus.CREATED);

      // const findResult = await readManager.findOne(UserReadEntity, {
      //   where: {
      //     id: mbtiUser1ReadId,
      //   },
      // });

      const find = await manager.findOne(UserMbtiEntity, {
        where: {
          userId: userId1,
          toUserId: userId2,
        },
      });

      expect(find.mbti).toStrictEqual('ISTP');
    });

    it('mbti 값을 동일한 유저가 2번 이상 입력할 경우 에러', async () => {
      await manager.save(UserMbtiEntity, {
        userId: submitUserId,
        mbti: 'ISTJ',
        toUserId: submitUserId,
      });

      const response = await request(app.getHttpServer()).post('/mbti').send({
        urlId: urlId,
        userId: submitUserId,
        mbti: 'ISTP',
        toUserId: submitUserId,
      });

      expect(response.body).toStrictEqual({
        code: 'USER_MBTI_SUBMIT',
        status: 409,
        timestamp: expect.any(String),
        path: 'POST /mbti',
        message: '이미 해당 mbti 값을 제출하였습니다.',
      });

      const find = await manager.find(UserMbtiEntity, {
        where: {
          userId: submitUserId,
          toUserId: submitUserId,
        },
      });

      expect(find.length).toStrictEqual(1);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, submitUserId);
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserEntity, otherUserId);
      await manager.delete(UserUrlEntity, urlId);

      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, mbtiUser1ReadId);
      await readManager.delete(UserReadEntity, mbtiUser2ReadId);
      await readManager.delete(UserReadEntity, mbtiSubmitUserReadId);
      await readManager.delete(UserReadEntity, mbtiOtherUserReadId);
    });
  });

  describe('GET /mbti/result', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

    let urlReadId: string;
    let mbtiUser1ReadId: string;
    let mbtiUser2ReadId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId1 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId1,
        })
      ).id;

      userId2 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId2,
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

      await manager.save(UserMbtiEntity, [
        {
          userId: userId1,
          toUserId: userId1,
          mbti: 'ISTJ',
        },
        {
          userId: userId2,
          toUserId: userId1,
          mbti: 'ISFP',
        },
      ]);

      mbtiUser1ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId1,
            urlId,
            nickname: mbtiUserId1.nickName,
            imgId: mbtiUserId1.imgId,
            mbti: [
              {
                mbti: 'ISTJ',
                toUserId: userId1,
              },
              {
                mbti: 'ESTJ',
                toUserId: userId2,
              },
            ],
          },
        } as any)
      ).id;

      mbtiUser2ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            nickname: mbtiUserId2.nickName,
            imgId: mbtiUserId2.imgId,
            mbti: [
              {
                mbti: 'ISTP',
                toUserId: userId1,
              },
              {
                mbti: 'ESTP',
                toUserId: userId2,
              },
            ],
          },
        } as any)
      ).id;
    });

    it('mbti 추측 결과 확인', async () => {
      const resposne = await request(app.getHttpServer())
        .get('/mbti/result')
        .query({
          urlId: urlId,
          toUserId: userId1,
        })
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual({
        answerUser: {
          imgId: mbtiUserId1.imgId,
          mbti: 'ISTJ',
          nickName: mbtiUserId1.nickName,
          userId: userId1,
        },
        guessingUsers: [
          {
            imgId: mbtiUserId2.imgId,
            mbti: 'ISTP',
            nickName: mbtiUserId2.nickName,
            userId: userId2,
          },
        ],
      });
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, mbtiUser1ReadId);
      await readManager.delete(UserReadEntity, mbtiUser2ReadId);
    });
  });

  describe('GET /mbti/final', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

    let urlReadId: string;
    let mbtiUser1ReadId: string;
    let mbtiUser2ReadId: string;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      userId1 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId1,
        })
      ).id;

      userId2 = (
        await manager.save(UserEntity, {
          urlId: urlId,
          ...mbtiUserId2,
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

      await manager.save(UserMbtiEntity, [
        {
          userId: userId1,
          toUserId: userId1,
          mbti: 'ISTJ',
        },
        {
          userId: userId2,
          toUserId: userId2,
          mbti: 'ISFP',
        },
      ]);

      mbtiUser1ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId1,
            urlId,
            nickname: mbtiUserId1.nickName,
            imgId: mbtiUserId1.imgId,
            mbti: [
              {
                mbti: 'ISTJ',
                toUserId: userId1,
              },
              {
                mbti: 'ESTJ',
                toUserId: userId2,
              },
            ],
          },
        } as any)
      ).id;

      mbtiUser2ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            nickname: mbtiUserId2.nickName,
            imgId: mbtiUserId2.imgId,
            mbti: [
              {
                mbti: 'ISTP',
                toUserId: userId1,
              },
              {
                mbti: 'ESTP',
                toUserId: userId2,
              },
            ],
          },
        } as any)
      ).id;
    });

    it('전체 mbti 결과 출력', async () => {
      const response = await request(app.getHttpServer())
        .get('/mbti/final')
        .query({ urlId })
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual([
        {
          imgId: mbtiUserId1.imgId,
          mbti: 'ISTJ',
          nickName: mbtiUserId1.nickName,
          userId: userId1,
        },
        {
          imgId: mbtiUserId2.imgId,
          mbti: 'ESTP',
          nickName: mbtiUserId2.nickName,
          userId: userId2,
        },
      ]);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await readManager.delete(UserReadEntity, mbtiUser1ReadId);
      await readManager.delete(UserReadEntity, mbtiUser2ReadId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
