import { IQuery } from '@nestjs/cqrs';

export class GetBalanceListQuery implements IQuery {
  constructor(public readonly balanceId: number) {}
}
