import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserAdjectiveExpressionMapper } from '../mapper';
import {
  AdjectiveExpressionFactory,
  IAdjectiveExpressionRepository,
} from '@domain';
import {
  ReconstituteAdjectiveExpressionArrayDto,
  SaveUserAdjectiveExpressionDto,
} from '@application';
import { DeleteAdjectiveExpressionListException } from '@common';
import { UserAdjectiveExpressionEntity } from '../entity';

@Injectable()
export class AdjectiveExpressionRepository
  implements IAdjectiveExpressionRepository
{
  constructor(
    private readonly manager: EntityManager,
    private readonly adjectiveExpressionFactory: AdjectiveExpressionFactory,
  ) {}

  async create(dto: SaveUserAdjectiveExpressionDto) {
    return await this.manager.transaction(async (manager) => {
      const result = await manager.save(
        UserAdjectiveExpressionEntity,
        UserAdjectiveExpressionMapper.toEntities(
          dto.userId,
          dto.expressionIdList,
        ),
      );

      const transformedResult = result.map((result) =>
        this.adjectiveExpressionFactory.reconstituteUserArray(
          new ReconstituteAdjectiveExpressionArrayDto(
            result.id,
            result.userId,
            result.adjectiveExpressionId,
            result.createdAt,
          ),
        ),
      );

      return transformedResult;
    });
  }

  async delete(userId: number, manager: EntityManager) {
    const result = await manager.delete(UserAdjectiveExpressionEntity, {
      userId,
    });

    if (!result.affected) {
      throw new DeleteAdjectiveExpressionListException();
    }
  }
}
