import { UserEventHandler } from '@application';
import { CreateUserInfoEvent, StatusUpdatedEvent } from '@domain';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

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

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventEmitter).toBeDefined();
  });

  describe('event: CreateUserInfoEvent', () => {
    const event = new CreateUserInfoEvent(123);

    it('handleCreateUserEvent', async () => {
      const emit = jest.spyOn(eventEmitter, 'emit');

      await handler.handle(event);

      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith('userCreated', { urlId: event.urlId });
    });
  });

  describe('event: StatusUpdatedEvent', () => {
    const event = new StatusUpdatedEvent(123, false);

    it('handleStatusUpdatedEvent', async () => {
      const emit = jest.spyOn(eventEmitter, 'emit');

      await handler.handle(event);

      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith('statusUpdated', {
        urlId: event.urlId,
        status: event.status,
      });
    });
  });
});
