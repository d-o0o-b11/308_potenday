import { EntityManager } from 'typeorm';
import { BaseEvent } from './event-sourcing.event';
import { EventEntity } from '@common/evnt.entity';

export class EventStore {
  async saveEvent(event: BaseEvent, manager: EntityManager) {
    const { eventType, eventMethod, ...rest } = event;

    const eventEntity = new EventEntity({
      eventType,
      eventMethod,
      event: rest,
    });

    await manager.save(eventEntity);
  }
}
