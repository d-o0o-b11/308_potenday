import { IEvent } from '@nestjs/cqrs';

export class StatusUpdatedEvent implements IEvent {
  constructor(
    public readonly url: string,
    public readonly status: boolean,
  ) {}
  get name(): string {
    return this.constructor.name;
  }
}
