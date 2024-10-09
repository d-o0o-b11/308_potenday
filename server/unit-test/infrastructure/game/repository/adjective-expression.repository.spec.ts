import { SaveUserAdjectiveExpressionDto } from '@application';
import { DeleteAdjectiveExpressionListException } from '@common';
import { AdjectiveExpressionFactory } from '@domain';
import {
  AdjectiveExpressionRepository,
  UserAdjectiveExpressionEntity,
  UserAdjectiveExpressionMapper,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('AdjectiveExpressionRepository', () => {
  let repository: AdjectiveExpressionRepository;
  let manager: EntityManager;
  let adjectiveExpressionFactory: AdjectiveExpressionFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdjectiveExpressionRepository,
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
        {
          provide: AdjectiveExpressionFactory,
          useValue: {
            reconstituteUserArray: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<AdjectiveExpressionRepository>(
      AdjectiveExpressionRepository,
    );
    manager = module.get<EntityManager>(getEntityManagerToken());
    adjectiveExpressionFactory = module.get<AdjectiveExpressionFactory>(
      AdjectiveExpressionFactory,
    );
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(manager).toBeDefined();
    expect(adjectiveExpressionFactory).toBeDefined();
  });

  describe('create', () => {
    const dto: SaveUserAdjectiveExpressionDto = {
      userId: 126,
      expressionIdList: [1, 11],
    };
    const mockSavedEntities = [
      {
        id: 1,
        userId: dto.userId,
        adjectiveExpressionId: dto.expressionIdList[0],
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: dto.userId,
        adjectiveExpressionId: dto.expressionIdList[1],
        createdAt: new Date(),
      },
    ];

    it('형용사 표현을 저장합니다.', async () => {
      const transaction = jest
        .spyOn(manager, 'transaction')
        .mockImplementation(async (cb: any) => {
          return await cb(manager);
        });
      const save = jest
        .spyOn(manager, 'save')
        .mockResolvedValue(
          mockSavedEntities as UserAdjectiveExpressionEntity[],
        );
      const reconstituteUserArray = jest.spyOn(
        adjectiveExpressionFactory,
        'reconstituteUserArray',
      );

      await repository.create(dto);

      expect(transaction).toBeCalledTimes(1);
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith(
        UserAdjectiveExpressionEntity,
        UserAdjectiveExpressionMapper.toEntities(
          dto.userId,
          dto.expressionIdList,
        ),
      );
      expect(reconstituteUserArray).toBeCalledTimes(mockSavedEntities.length);
    });
  });

  describe('delete', () => {
    const userId = 126;

    it('유저의 형용사 표현 데이터를 삭제합니다.', async () => {
      const delete2 = jest
        .spyOn(manager, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await repository.delete(userId, manager);

      expect(delete2).toBeCalledTimes(1);
      expect(delete2).toBeCalledWith(UserAdjectiveExpressionEntity, {
        userId,
      });
    });

    it('형용사 표현 데이터 삭제 실패 시 에러를 반환합니다.', async () => {
      const delete2 = jest
        .spyOn(manager, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete(userId, manager)).rejects.toThrowError(
        new DeleteAdjectiveExpressionListException(),
      );

      expect(delete2).toBeCalledTimes(1);
      expect(delete2).toBeCalledWith(UserAdjectiveExpressionEntity, {
        userId,
      });
    });
  });
});
