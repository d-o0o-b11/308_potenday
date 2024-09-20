import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IBalanceRepository, BalanceFactory } from '@domain';
import { UserBalanceMapper } from '../mapper';
// import { UserBalanceEntity } from '../entity/cud/user-balance.entity';
import {
  CreateUserBalanceDto,
  DeleteUserBalanceDto,
  ReconstituteBalanceDto,
} from '@application';
import { DeleteBalanceException } from '@common';
import { UserBalanceEntity } from '../entity';

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(
    private readonly balanceFactory: BalanceFactory,
    private readonly manager: EntityManager,
  ) {}

  async create(dto: CreateUserBalanceDto) {
    return await this.manager.transaction(async (manager) => {
      const result = await manager.save(
        UserBalanceEntity,
        UserBalanceMapper.toEntity(dto.userId, dto.balanceId, dto.balanceType),
      );

      return this.balanceFactory.reconstitute(
        new ReconstituteBalanceDto(
          result.id,
          result.userId,
          result.balanceId,
          result.balanceType,
          result.createdAt,
        ),
      );
    });
  }

  async delete(dto: DeleteUserBalanceDto, manager: EntityManager) {
    const { userId, balanceId } = dto;

    const result = await manager.softDelete(UserBalanceEntity, {
      userId,
      balanceId,
    });

    if (!result.affected) {
      throw new DeleteBalanceException();
    }

    return result;
  }
}
