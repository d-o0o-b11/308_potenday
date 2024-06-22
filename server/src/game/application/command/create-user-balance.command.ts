import { BalanceType } from '../../domain';

export class CreateUserBalanceCommand {
  constructor(
    public readonly url: string,
    public readonly urlId: number,
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
  ) {}
}
