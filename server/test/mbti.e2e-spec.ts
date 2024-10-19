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
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestTokenService } from './test-cookie.service';
import { JwtAuthGuard } from '@application';
import { TestJwtAuthGuard } from './auth-test.guard';
import * as cookieParser from 'cookie-parser';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('AdjectiveExpressionController (e2e)', () => {
  let app: INestApplication;
  let manager: EntityManager;
  let readManager: EntityManager;
  let testTokenService: TestTokenService;

  beforeAll(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [AppModule],
    //   providers: [],
    // }).compile();
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

  describe('GET /mbti', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

    let urlReadId: string;
    let mbtiUser1ReadId: string;
    let mbtiUser2ReadId: string;
    let token: { token: string };

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
            name: mbtiUserId1.name,
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
            name: mbtiUserId2.name,
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

      token = testTokenService.generateToken({
        urlId: urlId,
        userId: userId1,
      });
    });

    const testMbtiEndpoint = async (
      roundId: number,
      expectedUser: any,
      userId: number,
    ) => {
      const response = await request(app.getHttpServer())
        .get('/mbti')
        .query({
          // urlId: urlId,
          roundId: roundId,
        })
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        userId: userId,
        imgId: expectedUser.imgId,
        name: expectedUser.name,
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
            name: mbtiUserId1.name,
            imgId: mbtiUserId1.imgId,
          },
        } as any)
      ).id;

      mbtiUser2ReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: userId2,
            urlId,
            name: mbtiUserId2.name,
            imgId: mbtiUserId2.imgId,
          },
        } as any)
      ).id;

      mbtiSubmitUserReadId = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: submitUserId,
            urlId,
            name: mbtiSubmitUser.name,
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
            name: mbtiOtherUser.name,
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
      const token = testTokenService.generateToken({
        urlId,
        userId: userId1,
      });

      await request(app.getHttpServer())
        .post('/mbti')
        .send({
          mbti: 'ISTJ',
          toUserId: userId1,
        })
        .set('Cookie', [`test_token=${token.token}`])
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
      const token = testTokenService.generateToken({
        urlId,
        userId: userId1,
      });

      await request(app.getHttpServer())
        .post('/mbti')
        .send({
          mbti: 'ISTP',
          toUserId: userId2,
        })
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.CREATED);

      const find = await manager.findOne(UserMbtiEntity, {
        where: {
          userId: userId1,
          toUserId: userId2,
        },
      });

      expect(find.mbti).toStrictEqual('ISTP');
    });

    it('mbti 값을 동일한 유저가 2번 이상 입력할 경우 에러', async () => {
      const token = testTokenService.generateToken({
        urlId,
        userId: submitUserId,
      });

      await manager.save(UserMbtiEntity, {
        userId: submitUserId,
        mbti: 'ISTJ',
        toUserId: submitUserId,
      });

      const response = await request(app.getHttpServer())
        .post('/mbti')
        .send({
          mbti: 'ISTP',
          toUserId: submitUserId,
        })
        .set('Cookie', [`test_token=${token.token}`]);

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
            name: mbtiUserId1.name,
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
            name: mbtiUserId2.name,
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
      const token = testTokenService.generateToken({
        urlId,
        userId: userId1,
      });

      const resposne = await request(app.getHttpServer())
        .get('/mbti/result')
        .query({
          toUserId: userId1,
        })
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual({
        answerUser: {
          imgId: mbtiUserId1.imgId,
          mbti: 'ISTJ',
          name: mbtiUserId1.name,
          userId: userId1,
        },
        guessingUsers: [
          {
            imgId: mbtiUserId2.imgId,
            mbti: 'ISTP',
            name: mbtiUserId2.name,
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
            name: mbtiUserId1.name,
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
            name: mbtiUserId2.name,
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
      const token = testTokenService.generateToken({
        urlId,
        userId: 999999,
      });

      const response = await request(app.getHttpServer())
        .get('/mbti/final')
        .set('Cookie', [`test_token=${token.token}`])
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual([
        {
          imgId: mbtiUserId1.imgId,
          mbti: 'ISTJ',
          name: mbtiUserId1.name,
          userId: userId1,
        },
        {
          imgId: mbtiUserId2.imgId,
          mbti: 'ESTP',
          name: mbtiUserId2.name,
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
