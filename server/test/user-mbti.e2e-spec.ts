import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import { mbtiUserId1, mbtiUserId2, defaultUrl } from './data';
import { UserEntity, UserMbtiEntity, UserUrlEntity } from '@infrastructure';

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

  describe('GET /mbti', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

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
    });

    const testMbtiEndpoint = async (roundId: number, expectedUser: any) => {
      const response = await request(app.getHttpServer())
        .get('/mbti')
        .query({
          urlId: urlId,
          roundId: roundId,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        id: expect.any(Number),
        imgId: expectedUser.imgId,
        nickName: expectedUser.nickName,
        urlId: urlId,
      });
    };

    it('해당 라운드에 추측할 유저 정보 출력 (유저1)', async () => {
      await testMbtiEndpoint(1, mbtiUserId1);
    });

    it('해당 라운드에 추측할 유저 정보 출력 (유저2)', async () => {
      await testMbtiEndpoint(2, mbtiUserId2);
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  describe('POST /mbti', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;
    let submitUserId: number;
    let otherUserId: number;

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
          nickName: 'SUBMIT_USER',
          imgId: 2,
          urlId: urlId,
        })
      ).id;

      otherUserId = (
        await manager.save(UserEntity, {
          nickName: 'OTHER_USER',
          imgId: 2,
          urlId: urlId,
        })
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
        toUserId: userId1,
      });

      const response = await request(app.getHttpServer()).post('/mbti').send({
        urlId: urlId,
        userId: submitUserId,
        mbti: 'ISTP',
        toUserId: userId1,
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
          toUserId: userId1,
        },
      });

      expect(find.length).toStrictEqual(1);
    });

    it('다음 라운드 유저 mbti 추측값 저장', async () => {
      await manager.save(UserMbtiEntity, {
        userId: userId1,
        mbti: 'ISTJ',
        toUserId: submitUserId,
      });

      await request(app.getHttpServer())
        .post('/mbti')
        .send({
          urlId: urlId,
          userId: userId1,
          mbti: 'ISTP',
          toUserId: otherUserId,
        })
        .expect(HttpStatus.CREATED);

      const find = await manager.findOne(UserMbtiEntity, {
        where: {
          userId: userId1,
          toUserId: otherUserId,
        },
      });

      expect(find.mbti).toStrictEqual('ISTP');
    });

    afterAll(async () => {
      await manager.delete(UserEntity, submitUserId);
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserEntity, otherUserId);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  describe('GET /mbti/result', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

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
    });

    it('mbti 추측 결과 확인', async () => {
      const resposne = await request(app.getHttpServer())
        .get('/mbti/result')
        .query({
          toUserId: userId1,
        })
        .expect(HttpStatus.OK);

      expect(resposne.body).toStrictEqual({
        answerUser: {
          imgId: mbtiUserId1.imgId,
          mbti: 'ISTJ',
          nickName: mbtiUserId1.nickName,
          toUserId: userId1,
          userId: userId1,
        },
        guessingUsers: [
          {
            imgId: mbtiUserId2.imgId,
            mbti: 'ISFP',
            nickName: mbtiUserId2.nickName,
            toUserId: userId1,
            userId: userId2,
          },
        ],
      });
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId1);
      await manager.delete(UserEntity, userId2);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  describe('GET /mbti/final', () => {
    let urlId: number;
    let userId1: number;
    let userId2: number;

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
    });

    it('전체 mbti 결과 출력', async () => {
      const response = await request(app.getHttpServer())
        .get('/mbti/final')
        .query({ urlId: urlId })
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
          mbti: 'ISFP',
          nickName: mbtiUserId2.nickName,
          userId: userId2,
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
