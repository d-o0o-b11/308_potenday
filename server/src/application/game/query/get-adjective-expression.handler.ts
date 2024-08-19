import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetAdjectiveExpressionQuery } from './get-adjective-expression.query';
import { AdjectiveExpression, AdjectiveExpressionFactory } from '@domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AdjectiveExpressionReadEntity } from '@infrastructure/game/database/entity/read/adjective-expression.entity';

@Injectable()
@QueryHandler(GetAdjectiveExpressionQuery)
export class GetAdjectiveExpressionQueryHandler
  implements IQueryHandler<GetAdjectiveExpressionQuery>
{
  constructor(
    @InjectEntityManager('read')
    private readonly readManager: EntityManager,
    private readonly adjectiveExpressionFactory: AdjectiveExpressionFactory,
  ) {}

  async execute(): Promise<AdjectiveExpression[]> {
    const findResult = await this.readManager.find(
      AdjectiveExpressionReadEntity,
      {
        order: {
          id: 'ASC',
        },
      },
    );

    const result = findResult.map((adjective) =>
      this.adjectiveExpressionFactory.reconstituteArray(
        adjective.id,
        adjective.adjective,
      ),
    );

    return result;
  }
}
