import { BalanceType } from '@domain';
import { ICommand } from '@nestjs/cqrs';

export class CreateUserBalanceReadCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}
