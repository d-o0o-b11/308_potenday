import { Injectable } from '@nestjs/common';
import { UserUrl } from '../user-url';
import { User } from '../user';
import { EventBus } from '@nestjs/cqrs';
import { StatusUpdatedEvent } from '../url-status-update.event';

@Injectable()
export class UserUrlFactory {
  constructor(private eventBus: EventBus) {}

  update(url: string, status: boolean) {
    this.eventBus.publish(new StatusUpdatedEvent(url, status));
  }

  reconstitute(id: number, url: string, status: boolean): UserUrl {
    return new UserUrl(id, url, status);
  }

  reconstituteWithUser(
    id: number,
    url: string,
    status: boolean,
    users: User[],
  ): UserUrl {
    return new UserUrl(id, url, status, users);
  }
}
