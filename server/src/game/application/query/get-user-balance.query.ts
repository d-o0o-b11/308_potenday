import { IQuery } from '@nestjs/cqrs';

export class GetUserBalanceQuery implements IQuery {
  constructor(
    public readonly urlId: number,
    public readonly balanceId: number,
  ) {}
}
