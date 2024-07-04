import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { StatusUpdatedEvent } from '@user/domain';
import { UpdateUserUrlFactoryDto } from '@user/interface';

@Injectable()
export class UserUrlEventPublisher {
  constructor(private eventBus: EventBus) {}

  updateStatus(dto: UpdateUserUrlFactoryDto) {
    this.eventBus.publish(new StatusUpdatedEvent(dto.urlId, dto.status));
  }
}
