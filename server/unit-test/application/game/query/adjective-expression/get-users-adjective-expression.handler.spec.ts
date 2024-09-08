import {
  GetUsersAdjectiveExpressionQuery,
  GetUsersAdjectiveExpressionQueryHandler,
} from '@application';
import { IAdjectiveExpressionRepositoryReadRepository } from '@domain';
import { ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetUsersAdjectiveExpressionQueryHandler', () => {
  let handler: GetUsersAdjectiveExpressionQueryHandler;
  let adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersAdjectiveExpressionQueryHandler,
        {
          provide: ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
          useValue: {
            findUsersByUrlId: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<GetUsersAdjectiveExpressionQueryHandler>(
      GetUsersAdjectiveExpressionQueryHandler,
    );
    adjectiveExpressionReadRepository =
      module.get<IAdjectiveExpressionRepositoryReadRepository>(
        ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
      );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(adjectiveExpressionReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const query = new GetUsersAdjectiveExpressionQuery(111);
    const userList = [
      {
        getAdjectiveExpressions: () => ({
          adjectiveExpressionIdList: [1, 3, 11],
        }),
        getUserId: () => 11,
        getImgId: () => 2,
        getNickname: () => 'd_o0o_b11',
      },
    ] as any;

    const adjectivesList = [
      { adjective_adjective: '용감한' },
      { adjective_adjective: '대범한' },
      { adjective_adjective: '조용한' },
    ];

    it('유저의 형용사 표현을 출력합니다.', async () => {
      const findUsersByUrlId = jest
        .spyOn(adjectiveExpressionReadRepository, 'findUsersByUrlId')
        .mockResolvedValue(userList);

      const queryBuilder = readManager.createQueryBuilder();
      jest
        .spyOn(readManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawMany = jest
        .spyOn(queryBuilder, 'getRawMany')
        .mockResolvedValue(adjectivesList);

      await handler.execute(query);

      expect(findUsersByUrlId).toBeCalledTimes(1);
      expect(findUsersByUrlId).toBeCalledWith(query.urlId, readManager);

      userList.forEach((user) => {
        expect(select).toBeCalledTimes(userList.length);
        expect(select).toBeCalledWith('adjective.adjective');
        expect(where).toBeCalledTimes(userList.length);
        expect(where).toBeCalledWith('adjective.id IN (:...ids)', {
          ids: user.getAdjectiveExpressions().adjectiveExpressionIdList,
        });
        expect(getRawMany).toBeCalledTimes(userList.length);
        expect(getRawMany).toBeCalledWith();
      });
    });
  });
});
