import { BalanceType } from '@domain';
import { ICommand } from '@nestjs/cqrs';

export class CreateUserBalanceCommand implements ICommand {
  constructor(
    public readonly urlId: number,
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
  ) {}
}
