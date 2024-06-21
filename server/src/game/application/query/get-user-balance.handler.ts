import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { BALANCE_LIST_REPOSITORY_TOKEN } from '../../infrastructure';
import { BalanceList, IBalanceListRepository } from '../../domain';
import { GetUserBalanceQuery } from './get-user-balance.query';

@Injectable()
@QueryHandler(GetUserBalanceQuery)
export class GetUserBalanceQueryHandler
  implements IQueryHandler<GetUserBalanceQuery>
{
  constructor(
    @Inject(BALANCE_LIST_REPOSITORY_TOKEN)
    private balanceListRepository: IBalanceListRepository,
  ) {}

  async execute(query: GetUserBalanceQuery): Promise<BalanceList> {
    return await this.balanceListRepository.find(query.balanceId);
  }
}
