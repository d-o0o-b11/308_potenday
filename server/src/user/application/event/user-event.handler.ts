import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StatusUpdatedEvent, UserCreateEvent } from '../../domain';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(UserCreateEvent, StatusUpdatedEvent)
export class UserEventHandler
  implements IEventHandler<UserCreateEvent | StatusUpdatedEvent>
{
  constructor(private readonly eventEmitter: EventEmitter2) {}
  // 이벤트 핸들러는 커맨드 핸들러와는 다르게 여러 이벤트를 같은 이벤트 핸들러가 받도록 할 수 있음
  async handle(event: UserCreateEvent | StatusUpdatedEvent) {
    //switch문 event.name해도 된다. =>
    /**
     * 고민,, switch문 event.name 가능
     *   get name(): string {
          return this.constructor.name; // 이벤트 이름===클래스 이름
        }
     */
    switch (event.constructor) {
      case UserCreateEvent:
        this.handleUserCreateEvent(event as UserCreateEvent);
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
      url: event.url,
      status: event.status,
    });
  }

  private handleUserCreateEvent(event: UserCreateEvent) {
    this.eventEmitter.emit('userCreated', { urlId: event.urlId });
  }
}
