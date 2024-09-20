import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { AppModule } from '@app.module';
import { defaultUrl } from './data';
// import { UserUrlEntity } from '@infrastructure/user/database/entity/cud/user-url.entity';
import { CommonQuestionEntity, UserUrlEntity } from '@infrastructure';
// import { CommonQuestionEntity } from '@infrastructure/game/database/entity/cud/common-question.entity';

describe('CommonQuestionController (e2e)', () => {
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

  describe('POST /common-question', () => {
    let urlId: number;

    beforeAll(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
    });

    it('공통 질문 들어가기 전 초기 세팅을 생성합니다.', async () => {
      await request(app.getHttpServer())
        .post('/common-question')
        .query({ urlId: urlId })
        .expect(HttpStatus.CREATED);

      const find = await manager.findOne(CommonQuestionEntity, {
        where: {
          urlId: urlId,
        },
      });

      expect(find).not.toBeNull();
    });

    afterAll(async () => {
      await manager.delete(CommonQuestionEntity, urlId);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  describe('PATCH /common-question/next', () => {
    let urlId: number;

    beforeEach(async () => {
      urlId = (await manager.save(UserUrlEntity, defaultUrl)).id;
      await manager.save(CommonQuestionEntity, { urlId });
    });

    const testQuestionUpdate = async (
      questionId: number,
      expectedStates: boolean[],
    ) => {
      await request(app.getHttpServer())
        .patch('/common-question/next')
        .send({ urlId, questionId })
        .expect(HttpStatus.OK);

      const find = await manager.findOne(CommonQuestionEntity, {
        where: { urlId },
        select: {
          question1: true,
          question2: true,
          question3: true,
          question4: true,
        },
      });
      expect(find.question1).toStrictEqual(expectedStates[0]);
      expect(find.question2).toStrictEqual(expectedStates[1]);
      expect(find.question3).toStrictEqual(expectedStates[2]);
      expect(find.question4).toStrictEqual(expectedStates[3]);
    };

    it('첫번째 질문에서 다음으로 넘어가기를 누를 경우 question_1:true로 업데이트 됩니다.', async () => {
      await testQuestionUpdate(1, [true, false, false, false]);
    });

    it('두번째 질문에서 다음으로 넘어가기를 누를 경우 question_2:true로 업데이트 됩니다.', async () => {
      await testQuestionUpdate(2, [false, true, false, false]);
    });

    it('세번째 질문에서 다음으로 넘어가기를 누를 경우 question_3:true로 업데이트 됩니다.', async () => {
      await testQuestionUpdate(3, [false, false, true, false]);
    });

    it('네번째 질문에서 다음으로 넘어가기를 누를 경우 question_4:true로 업데이트 됩니다.', async () => {
      await testQuestionUpdate(4, [false, false, false, true]);
    });

    afterEach(async () => {
      await manager.delete(CommonQuestionEntity, urlId);
      await manager.delete(UserUrlEntity, urlId);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
