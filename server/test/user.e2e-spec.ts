import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager, JsonContains } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  defaultReadUrl,
  defaultUrl,
  defaultUser,
  gamingReadUrl,
  gamingUrl,
  gamingUser,
  maxReadUrl,
  maxUrl,
  maxUser,
} from './data';
import {
  EventEntity,
  UrlReadEntity,
  UserEntity,
  UserReadEntity,
  UserUrlEntity,
} from '@infrastructure';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe('UserController (e2e)', () => {
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

  describe('POST /user/check-in', () => {
    let urlId: number;
    let userId: number;
    let urlIdRead: string;
    let userReadId: string;

    let gamingUrlId: number;
    let gamingUrlIdRead: string;

    let maxUrlId: number;
    let maxUrlIdRead: string;
    let maxUserId: number[] = [];
    let maxUserIdRead: string[] = [];

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      urlIdRead = (
        await readManager.save(UrlReadEntity, {
          data: { ...defaultReadUrl, urlId },
        } as any)
      ).id;

      gamingUrlId = (await manager.save(UserUrlEntity, gamingUrl)).id;
      gamingUrlIdRead = (
        await readManager.save(UrlReadEntity, {
          data: { ...gamingReadUrl, urlId: gamingUrlId },
        } as any)
      ).id;

      maxUrlId = (await manager.save(UserUrlEntity, maxUrl)).id;
      maxUserId = await Promise.all(
        Array.from({ length: 4 }).map(async () => {
          const user = await manager.save(UserEntity, {
            ...maxUser,
            urlId: maxUrlId,
          });
          return user.id;
        }),
      );
      maxUrlIdRead = (
        await readManager.save(UrlReadEntity, {
          data: { ...maxReadUrl, urlId: maxUrlId, userIdList: maxUserId },
        } as any)
      ).id;
      maxUserIdRead = await Promise.all(
        maxUserId.map(async (element) => {
          const user = await readManager.save(UserReadEntity, {
            data: {
              userId: element,
              imgId: maxUser.imgId,
              nickname: maxUser.nickname,
              urlId: maxUrlId,
              createdAt: maxReadUrl.createdAt,
              updatedAt: maxReadUrl.updatedAt,
              deletedAt: maxReadUrl.deletedAt,
            },
          } as any);

          return user.id;
        }),
      );
    });

    it('닉네임 설정 및 성격 유형 검사 후 입장합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send({
          urlId: urlId,
          ...defaultUser,
        })
        .expect(HttpStatus.CREATED);

      userId = response.body.id;

      expect(response.body).toStrictEqual({
        id: expect.any(Number),
        imgId: defaultUser.imgId,
        nickName: defaultUser.nickName,
        urlId: urlId,
      });

      //eventBus로 인해 데이터 불일치가 발생해서 몇초 후에 테스트가 진행되야한다.
      await sleep(500);

      // const eventLog = await manager
      //   .createQueryBuilder(EventEntity, 'event')
      //   .where("event->>'userId' = :userId", { userId })
      //   .andWhere("type = 'CreateUserReadCommand'")
      //   .getOne();
      const eventLog = await manager.findOne(EventEntity, {
        where: {
          event: JsonContains({ userId }),
          type: 'CreateUserReadCommand',
        },
      });
      expect(eventLog).not.toBeNull();

      const userRead = await readManager.findOne(UserReadEntity, {
        where: {
          data: JsonContains({ userId, urlId }),
        },
      });
      userReadId = userRead.id;
      expect(userRead).not.toBeNull();

      //UrlRead에 private로 접근제한 걸려있다 이를 완화하기 위해선 facotry함수를 이용해서
      //UrlRead로 맵핑을 한번 해줘야하는데 일단은 any로 타입 수정 후 접근하였다.
      const urlRead: any = await readManager.findOne(UrlReadEntity, {
        where: {
          data: JsonContains({ urlId }),
        },
      });
      expect(urlRead.data.userIdList).toContain(userId);
    });

    it('존재하지 않는 urlId일 경우 에러가 반환됩니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send({ ...defaultUser, urlId: 999999 });

      expect(response.body).toStrictEqual({
        code: 'NOT_FOUND_URL',
        status: 404,
        timestamp: expect.any(String),
        path: 'POST /user/check-in',
        message: '존재하지 않는 URL 입니다.',
      });
    });

    it('해당 방이 게임중일 경우 에러가 반환됩니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send({ ...gamingUser, urlId: gamingUrlId });

      expect(response.body).toStrictEqual({
        code: 'URL_STATUS_FALSE',
        status: 409,
        timestamp: expect.any(String),
        path: 'POST /user/check-in',
        message: '해당 방은 게임 중이여서 입장이 불가능합니다.',
      });
    });

    it('해당 링크에 유저가 4명 존재 시 입장 할 경우 에러가 반환됩니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send({ ...maxUser, urlId: maxUrlId });

      await expect(response.body).toStrictEqual({
        code: 'MAXIMUM_URL',
        status: 409,
        path: 'POST /user/check-in',
        timestamp: expect.any(String),
        message: '최대 4명까지 이용할 수 있습니다.',
      });
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId);
      await manager.delete(UserUrlEntity, urlId);
      await readManager.delete(UserReadEntity, userReadId);
      await readManager.delete(UrlReadEntity, urlIdRead);

      await manager.delete(UserUrlEntity, gamingUrlId);
      await readManager.delete(UrlReadEntity, gamingUrlIdRead);

      await Promise.all(maxUserId.map((id) => manager.delete(UserEntity, id)));
      await manager.delete(UserUrlEntity, maxUrlId);
      await readManager.delete(UrlReadEntity, maxUrlIdRead);
      await Promise.all(
        maxUserIdRead.map((id) => readManager.delete(UserReadEntity, id)),
      );

      const findEvent = await manager.find(EventEntity, {
        where: {
          type: 'CreateUserReadCommand',
        },
      });
      await Promise.all(
        findEvent.map(async (element) => {
          await manager.delete(EventEntity, element.id);
        }),
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
