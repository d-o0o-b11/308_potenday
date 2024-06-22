import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN } from '../../infrastructure';
import { IUserAdjectiveExpressionRepository } from '../../domain';
import { GetUsersAdjectiveExpressionQuery } from './get-users-adjective-expression.query';
import { GroupByUserAdjectiveExpressionDto } from '../../interface';

@Injectable()
@QueryHandler(GetUsersAdjectiveExpressionQuery)
export class GetUsersAdjectiveExpressionQueryHandler
  implements IQueryHandler<GetUsersAdjectiveExpressionQuery>
{
  constructor(
    @Inject(USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private userAdjectiveExpressionRepository: IUserAdjectiveExpressionRepository,
  ) {}

  async execute(
    query: GetUsersAdjectiveExpressionQuery,
  ): Promise<GroupByUserAdjectiveExpressionDto[]> {
    return await this.userAdjectiveExpressionRepository.find({
      urlId: query.urlId,
    });
  }
}
