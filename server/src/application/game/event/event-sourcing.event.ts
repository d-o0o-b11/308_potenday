import { BalanceType } from '@domain';
import { BaseEvent } from '@interface';

export class CreateUserExpressionEvent {
  constructor(
    public readonly userId: number,
    public readonly adjectiveExpressionList: number[],
    public readonly createdAt: Date,
  ) {}
}

export class CreateUserExpressionReadEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly adjectiveExpressionList: number[],
  ) {}
}

export class DeleteUserExpressionEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
  ) {}
}

export class CreateUserBalanceEvent {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}

export class CreateUserBalanceReadEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}

export class DeleteUserBalanceEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly balanceId: number,
  ) {}
}
