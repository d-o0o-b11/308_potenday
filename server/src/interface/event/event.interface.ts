import { IEvent } from '@nestjs/cqrs';

export class BaseEvent implements IEvent {
  eventType: string;
  eventMethod: string;

  constructor(eventType: string, eventMethod: string) {
    this.eventType = eventType;
    this.eventMethod = eventMethod;
  }
}
