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
  constructor(public readonly count: number) {}
}

export class ReconstituteBalanceListDto {
  constructor(
    public readonly id: number,
    public readonly typeA: string,
    public readonly typeB: string,
  ) {}
}

export class ReconstituteBalanceArrayDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly nickName: string,
    public readonly imgId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly balanceGame?: { typeA: string; typeB: string },
  ) {}
}

export class ReconstituteBalanceDto {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}
