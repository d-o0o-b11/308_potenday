import { BaseEvent } from '@interface';

export class CreateUrlEvent {
  constructor(
    // public readonly eventType: string,
    // public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class CreateUrlReadEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class DeleteUrlEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
  ) {}
}

export class UpdateUrlStatusEvent {
  constructor(
    // public readonly eventType: string,
    // public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}

export class UpdateUrlReadStatusEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}

export class DeleteUpdateUrlStatusEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}

export class CreateUserEvent {
  constructor(
    // public readonly eventType: string,
    // public readonly eventMethod: string,
    public readonly userId: number,
    public readonly imgId: number,
    public readonly nickname: string,
    public readonly urlId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class CreateUserReadEvent implements BaseEvent {
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
  ) {}
}

export class DeleteUserEvent implements BaseEvent {
  constructor(
    public readonly eventType: string,
    public readonly eventMethod: string,
    public readonly urlId: number,
    public readonly userId: number,
  ) {}
}
