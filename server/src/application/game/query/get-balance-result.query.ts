import { IQuery } from '@nestjs/cqrs';

export class GetBalanceResultQuery implements IQuery {
  constructor(
    public readonly urlId: number,
    public readonly balanceId: number,
  ) {}
}
