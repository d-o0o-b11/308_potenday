import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { BALANCE_LIST_REPOSITORY_TOKEN } from '../../infrastructure';
import { BalanceList, IBalanceListRepository } from '../../domain';
import { GetBalanceListQuery } from './get-balance-list.query';

@Injectable()
@QueryHandler(GetBalanceListQuery)
export class GetBalanceListQueryHandler
  implements IQueryHandler<GetBalanceListQuery>
{
  constructor(
    @Inject(BALANCE_LIST_REPOSITORY_TOKEN)
    private balanceListRepository: IBalanceListRepository,
  ) {}

  async execute(query: GetBalanceListQuery): Promise<BalanceList> {
    return await this.balanceListRepository.find(query.balanceId);
  }
}
