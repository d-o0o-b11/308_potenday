import {
  FindUserMbtiDto,
  GetUserMbtiQuery,
  GetUserMbtiQueryHandler,
} from '@application';
import { IMbtiReadRepository } from '@domain';
import { MBTI_REPOSITORY_READ_TOKEN } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetUserMbtiQueryHandler', () => {
  let handler: GetUserMbtiQueryHandler;
  let mbtiReadRepository: IMbtiReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserMbtiQueryHandler,
        {
          provide: MBTI_REPOSITORY_READ_TOKEN,
          useValue: { findSubmitList: jest.fn() },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<GetUserMbtiQueryHandler>(GetUserMbtiQueryHandler);
    mbtiReadRepository = module.get<IMbtiReadRepository>(
      MBTI_REPOSITORY_READ_TOKEN,
    );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(mbtiReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const query = new GetUserMbtiQuery(111, 126);
    const mbtiList = [
      {
        getUserId: () => 126,
        getMbti: () => 'INTJ',
        getNickName: () => 'd_o0o_b11',
        getImgId: () => 1,
        getToUserId: () => 126,
      },
      {
        getUserId: () => 127,
        getMbti: () => 'INTP',
        getNickName: () => 'd_o0o_b22',
        getImgId: () => 2,
        getToUserId: () => 126,
      },
    ] as any;

    it('mbti 정답, 제출 정보를 조회합니다.', async () => {
      const findSubmitList = jest
        .spyOn(mbtiReadRepository, 'findSubmitList')
        .mockResolvedValue(mbtiList);

      const result = await handler.execute(query);

      expect(findSubmitList).toBeCalledTimes(1);
      expect(findSubmitList).toBeCalledWith(
        new FindUserMbtiDto(query.urlId, query.toUserId),
        readManager,
      );
      expect(result).toStrictEqual({
        answerUser: {
          imgId: mbtiList[0].getImgId(),
          mbti: mbtiList[0].getMbti(),
          nickName: mbtiList[0].getNickName(),
          userId: mbtiList[0].getUserId(),
        },
        guessingUsers: [
          {
            imgId: mbtiList[1].getImgId(),
            mbti: mbtiList[1].getMbti(),
            nickName: mbtiList[1].getNickName(),
            userId: mbtiList[1].getUserId(),
          },
        ],
      });
    });
  });
});
