import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import {
  defaultUrl,
  defaultUser,
  gamingUrl,
  gamingUser,
  maxUrl,
  maxUser,
} from './data';
import { UserUrlEntity } from '@user/infrastructure/database/entity/user-url.entity';
import { UserEntity } from '@user/infrastructure/database/entity/user.entity';

describe('UserController (e2e)', () => {
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

  describe('POST /user/check-in', () => {
    let urlId: number;
    let userId: number;

    let gamingUrlId: number;

    let maxUrlId: number;
    let maxUserId: number[] = [];

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      maxUrlId = (await manager.save(UserUrlEntity, maxUrl)).id;

      gamingUrlId = (await manager.save(UserUrlEntity, gamingUrl)).id;

      maxUserId = await Promise.all(
        Array.from({ length: 4 }).map(async () => {
          const user = await manager.save(UserEntity, {
            ...maxUser,
            urlId: maxUrlId,
          });
          return user.id;
        }),
      );
    });

    it('닉네임 설정 및 성격 유형 검사 후 입장합니다.', async () => {
      const createUserDto = defaultUser;

      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send({ ...createUserDto, urlId: urlId })
        .expect(HttpStatus.CREATED);

      userId = response.body.id;

      expect(response.body).toStrictEqual({
        id: expect.any(Number),
        imgId: defaultUser.imgId,
        nickName: defaultUser.nickName,
        urlId: urlId,
      });
    });

    it('존재하지 않는 urlId일 경우 에러가 반환됩니다.', async () => {
      const createUserDto = { ...defaultUser, urlId: 999999 };

      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send(createUserDto);

      expect(response.body).toStrictEqual({
        code: 'URL_NOT_FOUND',
        status: 404,
        timestamp: expect.any(String),
        path: 'POST /user/check-in',
        message: '존재하지 않는 URL 입니다.',
      });
    });

    it('해당 방이 게임중일 경우 에러가 반환됩니다.', async () => {
      const createUserDto = { ...gamingUser, urlId: gamingUrlId };

      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send(createUserDto);

      expect(response.body).toStrictEqual({
        code: 'URL_STATUS_FALSE',
        status: 409,
        timestamp: expect.any(String),
        path: 'POST /user/check-in',
        message: '해당 방은 게임 중이여서 입장이 불가능합니다.',
      });
    });

    it('해당 링크에 유저가 4명 존재 시 입장 할 경우 에러가 반환됩니다.', async () => {
      const createUserDto = maxUser;

      const response = await request(app.getHttpServer())
        .post('/user/check-in')
        .send({ ...createUserDto, urlId: maxUrlId });

      expect(response.body).toStrictEqual({
        code: 'URL_MAXIMUM_USER',
        status: 409,
        path: 'POST /user/check-in',
        timestamp: expect.any(String),
        message: '최대 4명까지 이용할 수 있습니다.',
      });
    });

    afterAll(async () => {
      await manager.delete(UserEntity, userId);
      await manager.delete(UserUrlEntity, urlId);
      await manager.delete(UserUrlEntity, gamingUrlId);
      await Promise.all(maxUserId.map((id) => manager.delete(UserEntity, id)));
      await manager.delete(UserUrlEntity, maxUrlId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
