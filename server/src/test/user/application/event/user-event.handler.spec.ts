import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEventHandler } from '@application';
import { StatusUpdatedEvent, UserCreateEvent } from '@domain';

describe('UserEventHandler', () => {
  let handler: UserEventHandler;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserEventHandler,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UserEventHandler>(UserEventHandler);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('handle', () => {
    it('사용자 생성 이벤트를 올바르게 처리해야 합니다', async () => {
      const userCreateEvent = new UserCreateEvent(1);

      const emit = jest.spyOn(eventEmitter, 'emit');

      await handler.handle(userCreateEvent);

      expect(emit).toHaveBeenCalledWith('userCreated', {
        urlId: userCreateEvent.urlId,
      });
    });

    it('상태 업데이트 이벤트를 올바르게 처리해야 합니다', async () => {
      const statusUpdatedEvent = new StatusUpdatedEvent(1, true);

      const emit = jest.spyOn(eventEmitter, 'emit');

      await handler.handle(statusUpdatedEvent);

      expect(emit).toHaveBeenCalledWith('statusUpdated', {
        urlId: statusUpdatedEvent.urlId,
        status: statusUpdatedEvent.status,
      });
    });
  });
});
