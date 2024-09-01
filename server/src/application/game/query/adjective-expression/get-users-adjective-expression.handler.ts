import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUsersAdjectiveExpressionQuery } from './get-users-adjective-expression.query';
import { ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN } from '@infrastructure';
import {
  AdjectiveExpression,
  IAdjectiveExpressionRepositoryReadRepository,
} from '@domain';
import { GroupByUserAdjectiveExpressionDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AdjectiveExpressionReadEntity } from '@infrastructure/game/database/entity/read/adjective-expression.entity';

@QueryHandler(GetUsersAdjectiveExpressionQuery)
export class GetUsersAdjectiveExpressionQueryHandler
  implements IQueryHandler<GetUsersAdjectiveExpressionQuery>
{
  constructor(
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository,
    @InjectEntityManager('read')
    private readonly readManager: EntityManager,
  ) {}

  async execute(
    query: GetUsersAdjectiveExpressionQuery,
  ): Promise<GroupByUserAdjectiveExpressionDto[]> {
    const userList =
      await this.adjectiveExpressionReadRepository.findUsersByUrlId(
        query.urlId,
        this.readManager,
      );

    return await Promise.all(
      userList.map(async (user) => {
        let adjectiveExpressionList: AdjectiveExpression[] = [];

        const adjectives = await this.readManager
          .createQueryBuilder(AdjectiveExpressionReadEntity, 'adjective')
          .select('adjective.adjective')
          .where('adjective.id IN (:...ids)', {
            ids: user.getAdjectiveExpressions().adjectiveExpressionIdList,
          })
          .getRawMany();

        adjectiveExpressionList = adjectives.map(
          (adj) => adj.adjective_adjective,
        );

        return {
          userId: user.getUserId(),
          imgId: user.getImgId(),
          nickName: user.getNickname(),
          adjectiveExpressionList,
        };
      }),
    );
  }
}
