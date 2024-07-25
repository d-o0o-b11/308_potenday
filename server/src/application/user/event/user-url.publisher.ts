import { StatusUpdatedEvent } from '@domain';
import { UpdateUserUrlFactoryDto } from '@interface';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class UserUrlEventPublisher {
  constructor(private eventBus: EventBus) {}

  updateStatus(dto: UpdateUserUrlFactoryDto) {
    this.eventBus.publish(new StatusUpdatedEvent(dto.urlId, dto.status));
  }
}
