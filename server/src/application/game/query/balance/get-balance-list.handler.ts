import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBalanceListQuery } from './get-balance-list.query';
import { BalanceList, BalanceListFactory } from '@domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ReconstituteBalanceListDto } from '@application';
import { BalanceListReadEntity } from '@infrastructure';

@QueryHandler(GetBalanceListQuery)
export class GetBalanceListQueryHandler
  implements IQueryHandler<GetBalanceListQuery>
{
  constructor(
    private readonly balanceListFactory: BalanceListFactory,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async execute(query: GetBalanceListQuery): Promise<BalanceList> {
    const result = await this.readManager.findOne(BalanceListReadEntity, {
      where: {
        id: query.balanceId,
      },
    });

    return this.balanceListFactory.reconstitute(
      new ReconstituteBalanceListDto(result.id, result.typeA, result.typeB),
    );
  }
}
