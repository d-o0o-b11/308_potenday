import { GetAdjectiveExpressionQueryHandler } from '@application';
import { AdjectiveExpressionFactory } from '@domain';
import { AdjectiveExpressionReadEntity } from '@infrastructure/game/database/entity/read/adjective-expression.entity';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GetAdjectiveExpressionQueryHandler', () => {
  let handler: GetAdjectiveExpressionQueryHandler;
  let readManager: EntityManager;
  let adjectiveExpressionFactory: AdjectiveExpressionFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAdjectiveExpressionQueryHandler,
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
        {
          provide: AdjectiveExpressionFactory,
          useValue: {
            reconstitute: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetAdjectiveExpressionQueryHandler>(
      GetAdjectiveExpressionQueryHandler,
    );
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
    adjectiveExpressionFactory = module.get<AdjectiveExpressionFactory>(
      AdjectiveExpressionFactory,
    );
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(readManager).toBeDefined();
    expect(adjectiveExpressionFactory).toBeDefined();
  });

  describe('execute', () => {
    const list = [
      {
        id: 1,
        adjective: '용감한',
      },
      {
        id: 2,
        adjective: '대범한',
      },
      {
        id: 3,
        adjective: '조용한',
      },
    ] as any;

    it('형용사 표현 리스트를 출력합니다.', async () => {
      const find = jest.spyOn(readManager, 'find').mockResolvedValue(list);
      const reconstitute = jest.spyOn(
        adjectiveExpressionFactory,
        'reconstitute',
      );

      await handler.execute();

      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith(AdjectiveExpressionReadEntity, {
        order: {
          id: 'ASC',
        },
      });
      expect(reconstitute).toBeCalledTimes(list.length);
      list.forEach((item, index) => {
        expect(reconstitute).toHaveBeenNthCalledWith(
          index + 1,
          item.id,
          item.adjective,
        );
      });
    });
  });
});
