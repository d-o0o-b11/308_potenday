import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager, JsonContains } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  updateFalseUrl,
  updateReadUrl,
  updateTrueReadUrl,
  updateTrueUrl,
  updateUrl,
  waitingNoneReadUrl,
  waitingNoneUrl,
  waitingReadUrl,
  waitingReadUser,
  waitingUrl,
  waitingUser,
} from './data';
import {
  EventEntity,
  UrlReadEntity,
  UserEntity,
  UserReadEntity,
  UserUrlEntity,
} from '@infrastructure';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('UserUrlController (e2e)', () => {
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

  describe('GET /url', () => {
    let urlId: number;
    let urlReadId: string;
    let eventId: string;

    it('무작위 url을 반환합니다.', async () => {
      const response = await request(app.getHttpServer()).post('/url');

      urlId = response.body.id;

      const findOne = await manager.findOne(UserUrlEntity, {
        where: {
          id: urlId,
        },
      });

      await sleep(500);

      const findReadOne = await readManager.findOne(UrlReadEntity, {
        where: {
          data: JsonContains({ urlId }),
        },
      });
      urlReadId = findReadOne.id;

      const eventLog = await manager.findOne(EventEntity, {
        where: {
          type: 'CreateUrlReadCommand',
          event: JsonContains({ urlId }),
        },
      });
      eventId = eventLog.id;

      expect(findOne).not.toBeNull();
      expect(findReadOne).not.toBeNull();
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UrlReadEntity, urlReadId);
      await manager.delete(EventEntity, eventId);
    });
  });

  describe('GET /url/waiting-room', () => {
    let waitingUrlId: number;
    let waitingUrlUserId: number;
    let waitingUrlIdRead: string;
    let waitingUrlUserIdRead: string;

    let waitingNoneUrlId: number;
    let waitingNoneUrlReadId: string;

    beforeAll(async () => {
      waitingUrlId = (await manager.save(UserUrlEntity, waitingUrl)).id;
      waitingUrlUserId = (
        await manager.save(UserEntity, { ...waitingUser, urlId: waitingUrlId })
      ).id;
      waitingUrlUserIdRead = (
        await readManager.save(UserReadEntity, {
          data: {
            userId: waitingUrlUserId,
            name: waitingReadUser.name,
            urlId: waitingUrlId,
            ...waitingReadUser,
          },
        } as any)
      ).id;
      waitingUrlIdRead = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...waitingReadUrl,
            urlId: waitingUrlId,
            userIdList: [waitingUrlUserId],
          },
        } as any)
      ).id;

      waitingNoneUrlId = (await manager.save(UserUrlEntity, waitingNoneUrl)).id;
      waitingNoneUrlReadId = (
        await readManager.save(UrlReadEntity, {
          data: { ...waitingNoneReadUrl, urlId: waitingNoneUrlId },
        } as any)
      ).id;
    });

    it('대기방 인원 수 + 해당 방의 유저 정보를 반환합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/waiting-room')
        .query({ urlId: waitingUrlId });

      expect(response.body).toStrictEqual({
        userCount: 1,
        userInfo: [
          {
            id: waitingUrlUserId,
            imgId: waitingUser.imgId,
            name: waitingUser.name,
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

    it('존재하지 않는 urlId일 경우 에러를 반환합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/waiting-room')
        .query({ urlId: 999999 });

      expect(response.body).toStrictEqual({
        code: 'NOT_FOUND_URL',
        status: 404,
        path: 'GET /url/waiting-room?urlId=999999',
        timestamp: expect.any(String),
        message: '존재하지 않는 URL 입니다.',
      });
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, waitingUrlId);
      await manager.delete(UserEntity, waitingUrlUserId);
      await readManager.delete(UrlReadEntity, waitingUrlIdRead);
      await readManager.delete(UserReadEntity, waitingUrlUserIdRead);

      await manager.delete(UserUrlEntity, waitingNoneUrlId);
      await readManager.delete(UrlReadEntity, waitingNoneUrlReadId);
    });
  });

  describe('PATCH /url/status', () => {
    let updateUrlId: number;
    let updateUrlReadId: string;
    let eventLogId: string;

    beforeAll(async () => {
      updateUrlId = (await manager.save(UserUrlEntity, updateUrl)).id;
      updateUrlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...updateReadUrl,
            urlId: updateUrlId,
          },
        } as any)
      ).id;
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

      await sleep(500);

      const findEvent = await manager.findOne(EventEntity, {
        where: {
          type: 'UpdateUrlReadStatusCommand',
          event: JsonContains({ urlId: updateUrlId }),
        },
      });
      eventLogId = findEvent.id;
      expect(findEvent).not.toBeNull();
      expect(findEvent.event).toStrictEqual({
        urlId: updateUrlId,
        status: false,
      });

      const findReadUrl = (await readManager.findOne(UrlReadEntity, {
        where: {
          id: updateUrlReadId,
        },
      })) as any;
      expect(findReadUrl).not.toBeNull();
      expect(findReadUrl.data.status).toStrictEqual(false);
    });

    it('존재하지 않는 url 상태 변경 시 에러를 반환합니다.', async () => {
      const response = await request(app.getHttpServer())
        .patch('/url/status')
        .query({ urlId: 999999 });

      expect(response.body).toStrictEqual({
        code: 'NOT_FOUND_URL',
        status: 404,
        path: 'PATCH /url/status?urlId=999999',
        timestamp: expect.any(String),
        message: '존재하지 않는 URL 입니다.',
      });
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, updateUrlId);
      await readManager.delete(UrlReadEntity, updateUrlReadId);
      await manager.delete(EventEntity, eventLogId);
    });
  });

  describe('GET /url/status', () => {
    let trueUrlId: number;
    let trueUrlReadId: string;
    let falseUrlId: number;
    let falseUrlReadId: string;

    beforeAll(async () => {
      trueUrlId = (await manager.save(UserUrlEntity, updateTrueUrl)).id;
      trueUrlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...updateTrueReadUrl,
            urlId: trueUrlId,
          },
        } as any)
      ).id;

      falseUrlId = (await manager.save(UserUrlEntity, updateFalseUrl)).id;
      falseUrlReadId = (
        await readManager.save(UrlReadEntity, {
          data: {
            ...updateFalseUrl,
            urlId: falseUrlId,
          },
        } as any)
      ).id;
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

    it('존재하지 않는 url 상태 조회 시 에러를 반환합니다.', async () => {
      const response = await request(app.getHttpServer())
        .get('/url/status')
        .query({ urlId: 999999 });

      expect(response.body).toStrictEqual({
        code: 'NOT_FOUND_URL',
        status: 404,
        path: 'GET /url/status?urlId=999999',
        timestamp: expect.any(String),
        message: '존재하지 않는 URL 입니다.',
      });
    });

    afterAll(async () => {
      await manager.delete(UserUrlEntity, trueUrlId);
      await manager.delete(UserUrlEntity, falseUrlId);
      await readManager.delete(UrlReadEntity, trueUrlReadId);
      await readManager.delete(UrlReadEntity, falseUrlReadId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
