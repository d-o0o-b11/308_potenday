import { BalanceType } from '@domain';

export class CreateBalanceReadDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}

export class CreateUserBalanceDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
  ) {}
}

export class FindSubmitUserDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
  ) {}
}

export class DeleteUserBalanceReadDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
  ) {}
}

export class DeleteUserBalanceDto {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
  ) {}
}

export class FindUserCountResponseDto {
  // count: number;
  constructor(public readonly count: number) {}
}
