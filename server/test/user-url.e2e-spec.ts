import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import { UserEntity, UserUrlEntity } from '@user';
import {
  updateFalseUrl,
  updateTrueUrl,
  updateUrl,
  waitingNoneUrl,
  waitingUrl,
  waitingUser,
} from './data';

describe('UserUrlController (e2e)', () => {
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

  describe('GET /url', () => {
    let urlId: number;
    it('무작위 url을 반환합니다.', async () => {
      const response = await request(app.getHttpServer()).get('/url');

      urlId = response.body.id;

      const findOne = await manager.findOne(UserUrlEntity, {
        where: {
          id: urlId,
        },
      });

      expect(findOne).not.toBeNull();
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  describe('GET /url/waiting-room', () => {
    let waitingUrlId: number;
    let waitingUrlUserId: number;

    let waitingNoneUrlId: number;

    beforeAll(async () => {
      waitingUrlId = (await manager.save(UserUrlEntity, waitingUrl)).id;
      waitingUrlUserId = (
        await manager.save(UserEntity, { ...waitingUser, urlId: waitingUrlId })
      ).id;

      waitingNoneUrlId = (await manager.save(UserUrlEntity, waitingNoneUrl)).id;
    });

    it('대기방 인원 수 + 해당 방의 유저 정보를 반환합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/waiting-room')
        .query({ urlId: waitingUrlId });

      expect(response.body).toStrictEqual({
        userCount: 1,
        userInfo: [
          {
            id: expect.any(Number),
            imgId: waitingUser.imgId,
            nickName: waitingUser.nickName,
            urlId: waitingUrlId,
          },
        ],
      });
    });

    it('대기방에 유저가 0명인 경우 count 0을 반환합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/waiting-room')
        .query({ urlId: waitingNoneUrlId });

      expect(response.body).toStrictEqual({
        userCount: 0,
        userInfo: [],
      });
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, waitingUrlId);
      await manager.delete(UserEntity, waitingUrlUserId);

      await manager.delete(UserUrlEntity, waitingNoneUrlId);
    });
  });

  describe('PATCH /url/status', () => {
    let updateUrlId: number;
    beforeAll(async () => {
      updateUrlId = (await manager.save(UserUrlEntity, updateUrl)).id;
    });

    it('[모두 모였어요] 버튼 클릭 시 url 상태를 false로 변경합니다.', async () => {
      await request(app.getHttpServer())
        .patch('/url/status')
        .query({ urlId: updateUrlId })
        .expect(HttpStatus.OK);

      const findUrl = await manager.findOne(UserUrlEntity, {
        where: {
          id: updateUrlId,
        },
      });

      expect(findUrl.status).toStrictEqual(false);
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, updateUrlId);
    });
  });

  describe('GET /url/status', () => {
    let trueUrlId: number;
    let falseUrlId: number;
    beforeAll(async () => {
      trueUrlId = (await manager.save(UserUrlEntity, updateTrueUrl)).id;
      falseUrlId = (await manager.save(UserUrlEntity, updateFalseUrl)).id;
    });

    it('url 상태가 true일 경우 입장 가능합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/status')
        .query({ urlId: trueUrlId });

      expect(response.body).toStrictEqual({ status: true });
    });

    it('url 상태가 false일 경우 입장 가능합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/status')
        .query({ urlId: falseUrlId });

      expect(response.body).toStrictEqual({ status: false });
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, trueUrlId);
      await manager.delete(UserUrlEntity, falseUrlId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
