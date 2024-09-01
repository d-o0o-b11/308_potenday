import { StatusUpdatedEvent, CreateUserInfoEvent } from '@domain';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(CreateUserInfoEvent, StatusUpdatedEvent)
export class UserEventHandler
  implements IEventHandler<CreateUserInfoEvent | StatusUpdatedEvent>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}
  // 이벤트 핸들러는 커맨드 핸들러와는 다르게 여러 이벤트를 같은 이벤트 핸들러가 받도록 할 수 있음
  async handle(event: CreateUserInfoEvent | StatusUpdatedEvent) {
    switch (event.constructor) {
      case CreateUserInfoEvent:
        this.handleCreateUserEvent(event as CreateUserInfoEvent);
        break;
      case StatusUpdatedEvent:
        this.handleStatusUpdatedEvent(event as StatusUpdatedEvent);
        break;
      default:
        break;
    }
  }

  private handleStatusUpdatedEvent(event: StatusUpdatedEvent) {
    this.eventEmitter.emit('statusUpdated', {
      urlId: event.urlId,
      status: event.status,
    });
  }

  private handleCreateUserEvent(event: CreateUserInfoEvent) {
    this.eventEmitter.emit('userCreated', { urlId: event.urlId });
  }
}
