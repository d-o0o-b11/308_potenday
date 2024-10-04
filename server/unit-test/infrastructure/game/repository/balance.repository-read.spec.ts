import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { BALANCE_TYPES, BalanceFactory } from '@domain';
import { BalanceReadRepository } from '@infrastructure';
import { MockEntityManager } from '@mock';
import {
  CreateBalanceReadDto,
  DeleteUserBalanceReadDto,
  FindSubmitUserDto,
} from '@application';
import { UserReadEntity } from '@infrastructure/user/database/entity/read/user-read.entity';
import {
  DeleteBalanceException,
  NotFoundBalanceException,
  NotFoundBalanceListException,
  UpdateBalanceException,
} from '@common';
import { FindUserBalanceDto } from '@interface';

describe('BalanceReadRepository', () => {
  let repository: BalanceReadRepository;
  let manager: EntityManager;
  let balanceFactory: BalanceFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceReadRepository,
        {
          provide: BalanceFactory,
          useValue: {
            reconstituteArray: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<BalanceReadRepository>(BalanceReadRepository);
    manager = MockEntityManager();
    balanceFactory = module.get<BalanceFactory>(BalanceFactory);
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(manager).toBeDefined();
    expect(balanceFactory).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateBalanceReadDto = {
      userId: 126,
      balanceId: 1,
      balanceType: BALANCE_TYPES.A,
      createdAt: new Date(),
    };

    it('유저의 balance 데이터를 업데이트합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await repository.create(dto, manager);

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

    it('balance 업데이트 실패 시 예외를 던집니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const where = jest.spyOn(queryBuilder, 'where');
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 0 });

      await expect(repository.create(dto, manager)).rejects.toThrowError(
        new UpdateBalanceException(),
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

  describe('isSubmitUser', () => {
    const dto: FindSubmitUserDto = { userId: 1, balanceId: 1 };

    it('balanceId가 존재하면 true를 반환합니다.', async () => {
      const mockUser = { balance: [{ balanceId: 1 }] };

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(mockUser);

      const result = await repository.isSubmitUser(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith("data->'balance' AS balance");
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toBe(true);
    });

    it('balanceId가 존재하지 않으면 false를 반환합니다.', async () => {
      const mockUser = { balance: [{ balanceId: 2 }] };

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(mockUser);

      const result = await repository.isSubmitUser(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith("data->'balance' AS balance");
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toBe(false);
    });

    it('유저 또는 balance가 존재하지 않으면 false를 반환합니다.', async () => {
      const dto: FindSubmitUserDto = { userId: 1, balanceId: 1 };

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(null);

      const result = await repository.isSubmitUser(dto, manager);

      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toBe(false);
    });
  });

  describe('findUserCount', () => {
    const dto: FindUserBalanceDto = { urlId: 1, balanceId: 1 };

    it('일치하는 balanceId를 가진 유저 수를 반환합니다.', async () => {
      const mockResult = { count: '5' };

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const andWhere = jest.spyOn(queryBuilder, 'andWhere');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(mockResult);

      const result = await repository.findUserCount(dto, manager);

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith('COUNT(*)', 'count');
      expect(where).toBeCalledTimes(1);
      expect(where).toBeCalledWith("data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(andWhere).toBeCalledTimes(2);
      expect(andWhere).toHaveBeenNthCalledWith(
        1,
        "data->'balance' IS NOT NULL",
      );
      expect(andWhere).toHaveBeenNthCalledWith(
        2,
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'balance') AS balance
          WHERE balance->>'balanceId' = :balanceId
        )
      `,
        { balanceId: dto.balanceId },
      );
      expect(getRawOne).toBeCalledTimes(1);
      expect(result).toEqual({ count: '5' });
    });
  });

  describe('find', () => {
    const dto: FindUserBalanceDto = { urlId: 1, balanceId: 1 };

    it('일치하는 balanceId를 가진 유저 데이터를 반환합니다.', async () => {
      const mockUsers = [
        {
          userId: '1',
          name: 'user1',
          imgId: 'image1',
          balance: JSON.stringify([
            { balanceId: 1, balanceType: BALANCE_TYPES.A },
          ]),
        },
      ];

      const mockBalanceGame = { typeA: 'A', typeB: 'B' };

      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const andWhere = jest.spyOn(queryBuilder, 'andWhere');
      const getRawMany = jest
        .spyOn(queryBuilder, 'getRawMany')
        .mockResolvedValue(mockUsers);
      const getOne = jest
        .spyOn(queryBuilder, 'getOne')
        .mockResolvedValue(mockBalanceGame);
      const reconstituteArray = jest
        .spyOn(balanceFactory, 'reconstituteArray')
        .mockReturnValue({
          getBalanceType: () => 'A',
          getBalanceGame: () => ({
            typeA: 'typeA',
            typeB: 'typeB',
          }),
          getUserId: () => 1,
          getName: () => 'd_o0o_b',
          getImgId: () => 1,
        } as any);

      await repository.find(dto, manager);

      expect(select).toBeCalledTimes(2);
      expect(select).toHaveBeenNthCalledWith(1, [
        "data->>'userId' AS userId",
        "data->>'name' AS name",
        "data->>'imgId' AS imgId",
        "data->>'balance' AS balance",
      ]);
      expect(select).toHaveBeenNthCalledWith(2, [
        'balanceGame.typeA',
        'balanceGame.typeB',
      ]);
      expect(where).toBeCalledTimes(2);
      expect(where).toHaveBeenNthCalledWith(1, "data->>'urlId' = :urlId", {
        urlId: dto.urlId,
      });
      expect(where).toHaveBeenNthCalledWith(2, 'balanceGame.id = :balanceId', {
        balanceId: dto.balanceId,
      });
      expect(andWhere).toBeCalledTimes(1);
      expect(andWhere).toBeCalledWith(
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'balance') AS balance
          WHERE balance->>'balanceId' = :balanceId
        )
      `,
        { balanceId: dto.balanceId },
      );
      expect(getRawMany).toBeCalledTimes(1);
      expect(getOne).toBeCalledTimes(1);
      expect(reconstituteArray).toBeCalledTimes(1);
    });

    it('일치하는 balanceId를 찾지 못하면 예외를 던집니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      jest.spyOn(queryBuilder, 'getOne').mockResolvedValue(null);

      await expect(repository.find(dto, manager)).rejects.toThrowError(
        new NotFoundBalanceListException(),
      );
    });
  });

  describe('delete', () => {
    const dto: DeleteUserBalanceReadDto = { userId: 1, balanceId: 1 };
    const mockUser = {
      balance: JSON.stringify([{ balanceId: 1, balanceType: 'A' }]),
    };

    it('balanceId가 일치하는 항목을 삭제합니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const select = jest.spyOn(queryBuilder, 'select');
      const where = jest.spyOn(queryBuilder, 'where');
      const getRawOne = jest
        .spyOn(queryBuilder, 'getRawOne')
        .mockResolvedValue(mockUser);
      const update = jest.spyOn(queryBuilder, 'update');
      const set = jest.spyOn(queryBuilder, 'set' as any);
      const execute = jest
        .spyOn(queryBuilder, 'execute')
        .mockResolvedValue({ affected: 1 });

      await expect(repository.delete(dto, manager)).resolves.not.toThrow();

      expect(select).toBeCalledTimes(1);
      expect(select).toBeCalledWith("user.data->'balance' AS balance");
      expect(where).toBeCalledTimes(2);
      expect(where).toHaveBeenNthCalledWith(
        1,
        "user.data->>'userId' = :userId",
        { userId: dto.userId },
      );
      expect(where).toHaveBeenNthCalledWith(2, "data->>'userId' = :userId", {
        userId: dto.userId,
      });
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(UserReadEntity);
      expect(set).toBeCalledTimes(1);
      expect(set).toBeCalledWith(
        expect.objectContaining({
          data: expect.any(Function),
        }),
      );
      expect(getRawOne).toBeCalledTimes(1);
      expect(execute).toBeCalledTimes(1);
    });

    it('유저 또는 balance가 존재하지 않으면 예외를 던집니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);
      jest.spyOn(queryBuilder, 'getRawOne').mockResolvedValue(null);

      await expect(repository.delete(dto, manager)).rejects.toThrowError(
        new NotFoundBalanceException(),
      );
    });

    it('balance 삭제 실패 시 예외를 던집니다.', async () => {
      const queryBuilder = manager.createQueryBuilder();
      jest.spyOn(manager, 'createQueryBuilder').mockReturnValue(queryBuilder);

      jest.spyOn(queryBuilder, 'getRawOne').mockResolvedValue(mockUser);
      jest.spyOn(queryBuilder, 'execute').mockResolvedValue({ affected: 0 });

      await expect(repository.delete(dto, manager)).rejects.toThrowError(
        new DeleteBalanceException(),
      );
    });
  });
});
