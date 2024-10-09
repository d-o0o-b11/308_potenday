import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AdjectiveExpression, AdjectiveExpressionFactory } from '@domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GetAdjectiveExpressionQuery } from './get-adjective-expression.query';
import { ReconstituteAdjectiveExpressionDto } from '@application';
import { AdjectiveExpressionReadEntity } from '@infrastructure';

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
      this.adjectiveExpressionFactory.reconstitute(
        new ReconstituteAdjectiveExpressionDto(
          adjective.id,
          adjective.adjective,
        ),
      ),
    );

    return result;
  }
}
