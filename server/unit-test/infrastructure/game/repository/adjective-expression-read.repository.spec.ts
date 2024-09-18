import { EntityManager } from 'typeorm';
import { AdjectiveExpressionFactory } from '@domain';
import { CreateUserAdjectiveExpressionReadDto } from '@application';
import {
  DeleteAdjectiveExpressionException,
  UpdateAdjectiveExpressionException,
} from '@common';
import { AdjectiveExpressionReadRepository } from '@infrastructure';
import { Test, TestingModule } from '@nestjs/testing';
import { MockEntityManager } from '@mock';
import { UserReadEntity } from '@infrastructure/user/database/entity/read/user-read.entity';

describe('AdjectiveExpressionReadRepository', () => {
  let repository: AdjectiveExpressionReadRepository;
  let entityManager: EntityManager;
  let adjectiveExpressionFactory: AdjectiveExpressionFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdjectiveExpressionReadRepository,
        {
          provide: AdjectiveExpressionFactory,
          useValue: {
            reconstituteAdjectiveExpressionRead: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<AdjectiveExpressionReadRepository>(
      AdjectiveExpressionReadRepository,
    );
    adjectiveExpressionFactory = module.get<AdjectiveExpressionFactory>(
      AdjectiveExpressionFactory,
    );
    entityManager = MockEntityManager();
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(adjectiveExpressionFactory).toBeDefined();
  });

  describe('create', () => {
    it('형용사 표현 데이터를 저장합니다.', async () => {
      const dto: CreateUserAdjectiveExpressionReadDto = {
        expressionIdList: [1, 2, 3],
        userId: 1,
        createdAt: new Date(),
      };

      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.create(dto, entityManager);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function), // 함수가 호출되었음을 확인
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(execute).toBeCalledTimes(1);
    });

    it('형용사 표현 데이터를 저장 과정에서 오류 발생시 에러를 반환합니다.', async () => {
      const dto: CreateUserAdjectiveExpressionReadDto = {
        expressionIdList: [1, 2, 3],
        userId: 1,
        createdAt: new Date(),
      };

      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(repository.create(dto, entityManager)).rejects.toThrowError(
        new UpdateAdjectiveExpressionException(),
      );

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(execute).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    const userId = 126;

    it('형용사 표현 데이터를 삭제합니다.', async () => {
      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.delete(userId, entityManager);

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", { userId });
      expect(execute).toBeCalledTimes(1);
    });

    it('형용사 표현 데이터를 삭제 과정에서 오류 발생시 에러를 반환합니다.', async () => {
      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(
        repository.delete(userId, entityManager),
      ).rejects.toThrowError(new DeleteAdjectiveExpressionException());

      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", { userId });
      expect(execute).toBeCalledTimes(1);
    });
  });

  describe('isSubmitUser', () => {
    const userId = 126;

    it('형용사 표현을 제출하지 않는 유저일 경우 false를 반환합니다.', async () => {
      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest.spyOn(queryBuilder, 'getRawOne');

      const result = await repository.isSubmitUser(userId, entityManager);
      expect(result).toBe(false);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith(
        "data->'adjectiveExpression' IS NOT NULL",
        'hasAdjectiveExpression',
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", { userId });
      expect(getRawOne).toBeCalledTimes(1);
    });

    it('형용사 표현을 제출한 유저일 경우 true를 반환합니다.', async () => {
      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue({
          hasAdjectiveExpression: true,
        });

      const result = await repository.isSubmitUser(userId, entityManager);
      expect(result).toBe(true);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith(
        "data->'adjectiveExpression' IS NOT NULL",
        'hasAdjectiveExpression',
      );
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", { userId });
      expect(getRawOne).toBeCalledTimes(1);
    });
  });

  describe('findUsersByUrlId', () => {
    it('url에 속한 유저들의 형용사 표현을 조회합니다.', async () => {
      const urlId = 123;
      const queryBuilder = entityManager.createQueryBuilder();
      jest
        .spyOn(entityManager, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      const mockUserList = [
        {
          id: 1,
          nickname: 'd_o0o_b',
          imgId: 1,
          adjectiveExpression: JSON.stringify({
            adjectiveExpressionIdList: [1, 2, 3],
            createdAt: new Date(),
          }),
        },
        {
          id: 2,
          nickname: 'd_o0o_b2',
          imgId: 3,
          adjectiveExpression: JSON.stringify({
            adjectiveExpressionIdList: [4, 5],
            createdAt: new Date(),
          }),
        },
      ];

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const andWhere = jest.spyOn(queryBuilder, 'andWhere');
      const orderBy = jest.spyOn(queryBuilder, 'orderBy');
      const getRawMany = jest
        .spyOn(queryBuilder, 'getRawMany')
        .mockResolvedValue(mockUserList);

      const reconstituteAdjectiveExpressionRead = jest.spyOn(
        adjectiveExpressionFactory,
        'reconstituteAdjectiveExpressionRead',
      );

      await repository.findUsersByUrlId(urlId, entityManager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith([
        "data->>'userId' AS id",
        "data->>'nickname' AS nickname",
        "data->>'imgId' AS imgId",
        "data->'adjectiveExpression' AS adjectiveExpression",
      ]);

      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", { urlId });

      expect(andWhere).toBeCalledTimes(3);
      expect(andWhere).toBeCalledWith(
        "data->'adjectiveExpression' IS NOT NULL",
      );
      expect(andWhere).toBeCalledWith(
        "data->'adjectiveExpression'->>'createdAt' IS NOT NULL",
      );
      expect(andWhere).toBeCalledWith(
        "jsonb_array_length(data->'adjectiveExpression'->'adjectiveExpressionIdList') > 0",
      );

      expect(orderBy).toBeCalledTimes(1);
      expect(orderBy).toBeCalledWith("data->>'userId'", 'ASC');

      expect(getRawMany).toBeCalledTimes(1);

      expect(reconstituteAdjectiveExpressionRead).toBeCalledTimes(
        mockUserList.length,
      );
    });
  });
});
