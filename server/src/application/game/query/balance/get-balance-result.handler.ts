import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetBalanceResultQuery } from './get-balance-result.query';
import { CalculatePercentagesResponseDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BALANCE_READ_REPOSITORY_TOKEN } from '@infrastructure';
import { IBalanceReadRepository } from '@domain';
import { FindBalanceUserReadDto } from '@application';

@QueryHandler(GetBalanceResultQuery)
export class GetBalanceResultQueryHandler
  implements IQueryHandler<GetBalanceResultQuery>
{
  constructor(
    @Inject(BALANCE_READ_REPOSITORY_TOKEN)
    private readonly balanceReadRepository: IBalanceReadRepository,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(
    query: GetBalanceResultQuery,
  ): Promise<CalculatePercentagesResponseDto[]> {
    return await this.balanceReadRepository.find(
      new FindBalanceUserReadDto(query.urlId, query.balanceId),

      this.readManager,
    );
  }
}
