import { EntityManager } from 'typeorm';
import { BaseEvent } from './event-sourcing.event';
import { EventEntity } from '@common/evnt.entity';

export class EventStore {
  saveEvent(event: BaseEvent, manager: EntityManager) {
    const { eventType, eventMethod, ...rest } = event;

    const eventEntity = new EventEntity({
      eventType,
      eventMethod,
      event: rest,
    });

    manager.save(eventEntity);
  }
}
