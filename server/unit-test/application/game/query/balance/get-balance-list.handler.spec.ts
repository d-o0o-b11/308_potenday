import {
  GetBalanceListQuery,
  GetBalanceListQueryHandler,
  ReconstituteBalanceListDto,
} from '@application';
import { BalanceListFactory } from '@domain';
import { BalanceListReadEntity } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetBalanceListQueryHandler', () => {
  let handler: GetBalanceListQueryHandler;
  let balanceListFactory: BalanceListFactory;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBalanceListQueryHandler,
        {
          provide: BalanceListFactory,
          useValue: {
            reconstitute: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<GetBalanceListQueryHandler>(
      GetBalanceListQueryHandler,
    );
    balanceListFactory = module.get<BalanceListFactory>(BalanceListFactory);
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(balanceListFactory).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const query = new GetBalanceListQuery(1);
    const findResult = {
      id: 1,
      typeA: 'A 밸런스',
      typeB: 'B 밸런스',
    };

    it('밸런스 질문 리스트를 조회합니다.', async () => {
      const findOne = jest
        .spyOn(readManager, 'findOne')
        .mockResolvedValue(findResult);
      const reconstitute = jest.spyOn(balanceListFactory, 'reconstitute');

      await handler.execute(query);

      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith(BalanceListReadEntity, {
        where: {
          id: query.balanceId,
        },
      });
      expect(reconstitute).toBeCalledTimes(1);
      expect(reconstitute).toBeCalledWith(
        new ReconstituteBalanceListDto(
          findResult.id,
          findResult.typeA,
          findResult.typeB,
        ),
      );
    });
  });
});
