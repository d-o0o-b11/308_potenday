import { BalanceType } from '@domain';
import { BaseEvent } from '@interface';

export class CreateUserExpressionEvent {
  constructor(
    public readonly userId: number,
    public readonly adjectiveExpressionList: number[],
    public readonly createdAt: Date,
  ) {}
}

export class CreateUserExpressionReadEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly adjectiveExpressionList: number[],
  ) {
    super(eventType, eventMethod);
  }
}

export class DeleteUserExpressionEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
  ) {
    super(eventType, eventMethod);
  }
}

export class CreateUserBalanceEvent {
  constructor(
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {}
}

export class CreateUserBalanceReadEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly balanceId: number,
    public readonly balanceType: BalanceType,
    public readonly createdAt: Date,
  ) {
    super(eventType, eventMethod);
  }
}

export class DeleteUserBalanceEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly balanceId: number,
  ) {
    super(eventType, eventMethod);
  }
}

export class CreateUserMbtiEvent {
  constructor(
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
    public readonly mbtiId: number,
    public readonly createdAt: Date,
  ) {}
}

export class CreateUserMbtiReadEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly mbti: string,
    public readonly toUserId: number,
    public readonly createdAt: Date,
  ) {
    super(eventType, eventMethod);
  }
}

export class DeleteUserMbtiEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly mbtiId: number,
  ) {
    super(eventType, eventMethod);
  }
}
