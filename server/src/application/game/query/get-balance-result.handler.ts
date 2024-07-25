import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetBalanceResultQuery } from './get-balance-result.query';
import { USER_BALANCE_REPOSITORY_TOKEN } from '@infrastructure';
import { IUserBalanceRepository } from '@domain';
import { CalculatePercentagesResponseDto } from '@interface';

@Injectable()
@QueryHandler(GetBalanceResultQuery)
export class GetBalanceResultQueryHandler
  implements IQueryHandler<GetBalanceResultQuery>
{
  constructor(
    @Inject(USER_BALANCE_REPOSITORY_TOKEN)
    private userBalanceRepository: IUserBalanceRepository,
  ) {}

  async execute(
    query: GetBalanceResultQuery,
  ): Promise<CalculatePercentagesResponseDto[]> {
    return await this.userBalanceRepository.find({
      urlId: query.urlId,
      balanceId: query.balanceId,
    });
  }
}
