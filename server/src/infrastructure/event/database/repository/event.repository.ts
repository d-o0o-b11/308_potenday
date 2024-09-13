import { EntityManager } from 'typeorm';
import { EventEntity } from '@infrastructure/event/database/entity/evnt.entity';
import { BaseEvent } from '@interface';
import { IEventRepository } from '@domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventRepository implements IEventRepository {
  async create(event: BaseEvent, manager: EntityManager) {
    const { eventType, eventMethod, ...rest } = event;

    await manager.save(
      new EventEntity({
        eventType,
        eventMethod,
        event: rest,
      }),
    );
  }
}
