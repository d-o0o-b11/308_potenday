import {
  GetUsersMbtiInUrlQuery,
  GetUsersMbtiInUrlQueryHandler,
} from '@application';
import { IMbtiReadRepository } from '@domain';
import { MBTI_REPOSITORY_READ_TOKEN } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetUsersMbtiInUrlQueryHandler', () => {
  let handler: GetUsersMbtiInUrlQueryHandler;
  let mbtiReadRepository: IMbtiReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersMbtiInUrlQueryHandler,
        {
          provide: MBTI_REPOSITORY_READ_TOKEN,
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<GetUsersMbtiInUrlQueryHandler>(
      GetUsersMbtiInUrlQueryHandler,
    );
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
    const query = new GetUsersMbtiInUrlQuery(111);
    const findResult = [
      {
        getUserId: () => 126,
        getNickName: () => 'd_o0o_b11',
        getImgId: () => 1,
        getMbti: () => 'ISTJ',
      },
      {
        getUserId: () => 127,
        getNickName: () => 'd_o0o_b22',
        getImgId: () => 2,
        getMbti: () => 'ESTJ',
      },
    ] as any;

    it('모든 유저의 mbti 정보 조회합니다.', async () => {
      const find = jest
        .spyOn(mbtiReadRepository, 'find')
        .mockResolvedValue(findResult);

      const result = await handler.execute(query);

      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith(query.urlId, readManager);
      expect(result).toStrictEqual([
        {
          imgId: findResult[0].getImgId(),
          mbti: findResult[0].getMbti(),
          nickName: findResult[0].getNickName(),
          userId: findResult[0].getUserId(),
        },
        {
          imgId: findResult[1].getImgId(),
          mbti: findResult[1].getMbti(),
          nickName: findResult[1].getNickName(),
          userId: findResult[1].getUserId(),
        },
      ]);
    });
  });
});
