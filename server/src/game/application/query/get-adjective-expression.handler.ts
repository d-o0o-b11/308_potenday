import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetAdjectiveExpressionQuery } from './get-adjective-expression.query';
import { ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN } from '../../infrastructure';
import {
  AdjectiveExpression,
  IAdjectiveExpressionRepository,
} from '../../domain';

@Injectable()
@QueryHandler(GetAdjectiveExpressionQuery)
export class GetAdjectiveExpressionQueryHandler
  implements IQueryHandler<GetAdjectiveExpressionQuery>
{
  constructor(
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private adjectiveExpressionRepository: IAdjectiveExpressionRepository,
  ) {}

  async execute(): Promise<AdjectiveExpression[]> {
    return await this.adjectiveExpressionRepository.find();
  }
}
