import { BaseEvent } from '@interface';

export class CreateUrlEvent {
  constructor(
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class CreateUrlReadEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {
    super(eventType, eventMethod);
  }
}

export class DeleteUrlEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
  ) {
    super(eventType, eventMethod);
  }
}

export class UpdateUrlStatusEvent {
  constructor(
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}

export class UpdateUrlReadStatusEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly status: boolean,
  ) {
    super(eventType, eventMethod);
  }
}

export class DeleteUpdateUrlStatusEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly status: boolean,
  ) {
    super(eventType, eventMethod);
  }
}

export class CreateUserEvent {
  constructor(
    public readonly userId: number,
    public readonly imgId: number,
    public readonly nickname: string,
    public readonly urlId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class CreateUserReadEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly userId: number,
    public readonly imgId: number,
    public readonly nickname: string,
    public readonly urlId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {
    super(eventType, eventMethod);
  }
}

export class DeleteUserEvent extends BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly userId: number,
  ) {
    super(eventType, eventMethod);
  }
}
