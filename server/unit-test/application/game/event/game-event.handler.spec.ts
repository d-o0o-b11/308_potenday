import { GameEventHandler, GameNextEvent } from '@application';
import { IEventRepository } from '@domain';
import { EVENT_REPOSITORY_TOKEN } from '@infrastructure';
import { MockEntityManager } from '@mock';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('GameEventHandler', () => {
  let handler: GameEventHandler;
  let eventEmitter: EventEmitter2;
  let eventRepository: IEventRepository;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameEventHandler,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: EVENT_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<GameEventHandler>(GameEventHandler);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    manager = module.get<EntityManager>(getEntityManagerToken());
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventEmitter).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(manager).toBeDefined();
  });

  describe('event: GameNextEvent', () => {
    const event = new GameNextEvent('GameNextEvent', 'event', 111);

    it('statusUpdated 이벤트에 데이터를 전송합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const emit = jest.spyOn(eventEmitter, 'emit');

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith('statusUpdated', {
        urlId: event.urlId,
        status: true,
      });
    });
  });
});
