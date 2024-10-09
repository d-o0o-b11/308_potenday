import { EntityManager } from 'typeorm';
import { BaseEvent } from '@interface';
import { IEventRepository } from '@domain';
import { Injectable } from '@nestjs/common';
import { EventEntity } from '../entity';

@Injectable()
export class EventRepository implements IEventRepository {
  async create(event: BaseEvent, manager: EntityManager) {
    const { eventType, eventMethod, ...rest } = event;

    await manager.save(
      new EventEntity({
        type: eventType,
        method: eventMethod,
        event: rest,
      }),
    );
  }
}
