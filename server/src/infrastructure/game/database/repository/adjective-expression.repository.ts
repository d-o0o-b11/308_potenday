import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserAdjectiveExpressionMapper } from '../mapper';
import {
  AdjectiveExpressionFactory,
  IAdjectiveExpressionRepository,
} from '@domain';
import { SaveUserAdjectiveExpressionDto } from '@interface';
import { UserAdjectiveExpressionEntity } from '../entity/cud/user-adjective-expression.entity';

@Injectable()
export class AdjectiveExpressionRepository
  implements IAdjectiveExpressionRepository
{
  constructor(
    private manager: EntityManager,
    private adjectiveExpressionFactory: AdjectiveExpressionFactory,
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
          result.id,
          result.userId,
          result.adjectiveExpressionId,
          result.createdAt,
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
      throw new Error('형용사 표현 삭제과정에서 오류가 발생하였습니다.');
    }
  }
}
