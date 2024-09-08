import {
  GetBalanceResultQuery,
  GetBalanceResultQueryHandler,
} from '@application';
import { IBalanceReadRepository } from '@domain';
import { BALANCE_READ_REPOSITORY_TOKEN } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetBalanceResultQueryHandler', () => {
  let handler: GetBalanceResultQueryHandler;
  let balanceReadRepository: IBalanceReadRepository;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBalanceResultQueryHandler,
        {
          provide: BALANCE_READ_REPOSITORY_TOKEN,
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

    handler = module.get<GetBalanceResultQueryHandler>(
      GetBalanceResultQueryHandler,
    );
    balanceReadRepository = module.get<IBalanceReadRepository>(
      BALANCE_READ_REPOSITORY_TOKEN,
    );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(balanceReadRepository).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const query = new GetBalanceResultQuery(133, 2);

    it('밸런스 질문을 조회합니다.', async () => {
      const find = jest.spyOn(balanceReadRepository, 'find');

      await handler.execute(query);

      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith(
        {
          urlId: query.urlId,
          balanceId: query.balanceId,
        },
        readManager,
      );
    });
  });
});
