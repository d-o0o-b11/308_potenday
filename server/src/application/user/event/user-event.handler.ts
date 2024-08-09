import { StatusUpdatedEvent, CreateUserEvent } from '@domain';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * @memo
 * 어디서 사용하는지 확인 필요
 * 구조 개선 필요
 */
@EventsHandler(CreateUserEvent, StatusUpdatedEvent)
export class UserEventHandler
  implements IEventHandler<CreateUserEvent | StatusUpdatedEvent>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}
  // 이벤트 핸들러는 커맨드 핸들러와는 다르게 여러 이벤트를 같은 이벤트 핸들러가 받도록 할 수 있음
  async handle(event: CreateUserEvent | StatusUpdatedEvent) {
    switch (event.constructor) {
      case CreateUserEvent:
        this.handleCreateUserEvent(event as CreateUserEvent);
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

  private handleCreateUserEvent(event: CreateUserEvent) {
    this.eventEmitter.emit('userCreated', { urlId: event.urlId });
  }
}
