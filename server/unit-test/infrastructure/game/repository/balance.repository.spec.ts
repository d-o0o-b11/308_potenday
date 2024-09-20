import {
  CreateUserBalanceDto,
  DeleteUserBalanceDto,
  ReconstituteBalanceDto,
} from '@application';
import { DeleteBalanceException } from '@common';
import { BALANCE_TYPES, BalanceFactory } from '@domain';
import {
  BalanceRepository,
  UserBalanceEntity,
  UserBalanceMapper,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('BalanceRepository', () => {
  let repository: BalanceRepository;
  let balanceFactory: BalanceFactory;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceRepository,
        {
          provide: BalanceFactory,
          useValue: {
            reconstitute: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    repository = module.get<BalanceRepository>(BalanceRepository);
    balanceFactory = module.get<BalanceFactory>(BalanceFactory);
    manager = module.get<EntityManager>(getEntityManagerToken());
  });

  it('IsDefined', () => {
    expect(repository).toBeDefined();
    expect(balanceFactory).toBeDefined();
    expect(manager).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateUserBalanceDto = {
      userId: 126,
      balanceId: 3,
      balanceType: BALANCE_TYPES.B,
    };

    const result = {
      id: 111,
      userId: dto.userId,
      balanceId: dto.balanceId,
      balanceType: dto.balanceType,
      createdAt: new Date(),
    } as UserBalanceEntity;

    it('balance를 생성합니다.', async () => {
      const transaction = jest
        .spyOn(manager, 'transaction')
        .mockImplementation(async (cb: any) => {
          return await cb(manager);
        });
      const save = jest.spyOn(manager, 'save').mockResolvedValue(result);
      const reconstitute = jest.spyOn(balanceFactory, 'reconstitute');

      await repository.create(dto);

      expect(transaction).toBeCalledTimes(1);
      expect(save).toBeCalledTimes(1);
      expect(save).toBeCalledWith(
        UserBalanceEntity,
        UserBalanceMapper.toEntity(dto.userId, dto.balanceId, dto.balanceType),
      );
      expect(reconstitute).toBeCalledTimes(1);
      expect(reconstitute).toBeCalledWith(
        new ReconstituteBalanceDto(
          result.id,
          result.userId,
          result.balanceId,
          result.balanceType,
          result.createdAt,
        ),
      );
    });
  });

  describe('delete', () => {
    const dto: DeleteUserBalanceDto = {
      userId: 126,
      balanceId: 2,
    };

    it('balance를 삭제합니다.', async () => {
      const softDelete = jest
        .spyOn(manager, 'softDelete')
        .mockResolvedValue({ affected: 1 } as any);

      await repository.delete(dto, manager);

      expect(softDelete).toBeCalledTimes(1);
      expect(softDelete).toBeCalledWith(UserBalanceEntity, {
        userId: dto.userId,
        balanceId: dto.balanceId,
      });
    });

    it('balance를 삭제 실패 시 에러를 반환합니다.', async () => {
      const softDelete = jest
        .spyOn(manager, 'softDelete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(repository.delete(dto, manager)).rejects.toThrowError(
        new DeleteBalanceException(),
      );

      expect(softDelete).toBeCalledTimes(1);
      expect(softDelete).toBeCalledWith(UserBalanceEntity, {
        userId: dto.userId,
        balanceId: dto.balanceId,
      });
    });
  });
});
