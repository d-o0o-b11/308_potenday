import { IEvent } from '@nestjs/cqrs';

export class StatusUpdatedEvent implements IEvent {
  constructor(
    public readonly urlId: number,
    public readonly status: boolean,
  ) {}
}
