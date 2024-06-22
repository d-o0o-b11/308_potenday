import { Injectable } from '@nestjs/common';
import { UserUrl } from '../user-url';
import { User } from '../user';
import { EventBus } from '@nestjs/cqrs';
import { StatusUpdatedEvent } from '../url-status-update.event';
import {
  ReconstituteFactoryDto,
  ReconstituteWithUserFactoryDto,
  UpdateUserUrlFactoryDto,
} from '../../interface';

@Injectable()
export class UserUrlFactory {
  constructor(private eventBus: EventBus) {}

  update(dto: UpdateUserUrlFactoryDto) {
    this.eventBus.publish(new StatusUpdatedEvent(dto.url, dto.status));
  }

  reconstitute(dto: ReconstituteFactoryDto): UserUrl {
    return new UserUrl(dto.id, dto.url, dto.status);
  }

  reconstituteWithUser(dto: ReconstituteWithUserFactoryDto): UserUrl {
    return new UserUrl(dto.id, dto.url, dto.status, dto.users);
  }
}
