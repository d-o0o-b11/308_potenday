import {
  CreateMbtiReadDto,
  CreateUserMbtiReadCommand,
  CreateUserMbtiReadCommandHandler,
  CreateUserMbtiReadEvent,
  DeleteUserMbtiEvent,
} from '@application';
import { IEventRepository, IMbtiReadRepository } from '@domain';
import {
  EVENT_REPOSITORY_TOKEN,
  MBTI_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('CreateUserMbtiReadCommandHandler', () => {
  let handler: CreateUserMbtiReadCommandHandler;
  let eventRepository: IEventRepository;
  let mbtiReadRepository: IMbtiReadRepository;
  let eventBus: EventBus;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserMbtiReadCommandHandler,
        {
          provide: EVENT_REPOSITORY_TOKEN,
          useValue: { create: jest.fn() },
        },
        {
          provide: MBTI_REPOSITORY_READ_TOKEN,
          useValue: { create: jest.fn() },
        },
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
        {
          provide: getEntityManagerToken(),
          useValue: MockEntityManager(),
        },
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
      ],
    }).compile();

    handler = module.get<CreateUserMbtiReadCommandHandler>(
      CreateUserMbtiReadCommandHandler,
    );
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    mbtiReadRepository = module.get<IMbtiReadRepository>(
      MBTI_REPOSITORY_READ_TOKEN,
    );
    eventBus = module.get<EventBus>(EventBus);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(mbtiReadRepository).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserMbtiReadCommand(
      126,
      'ISTJ',
      127,
      200,
      new Date('2024-08-29'),
    );

    it('mbti Read DB에 저장합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const mbtiReadCreate = jest.spyOn(mbtiReadRepository, 'create');
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserMbtiReadEvent(
          'CreateUserMbtiReadEvent',
          'save',
          command.userId,
          command.mbti,
          command.toUserId,
          command.createdAt,
        ),
        manager,
      );
      expect(mbtiReadCreate).toBeCalledTimes(1);
      expect(mbtiReadCreate).toBeCalledWith(
        new CreateMbtiReadDto(
          command.mbtiId,
          command.userId,
          command.mbti,
          command.toUserId,
          command.createdAt,
        ),
        readManager,
      );
      expect(eventBusPublish).toBeCalledTimes(0);
    });

    it('mbti Read DB에 저장 시 오류가 발생할 경우 DeleteUserMbtiEvent 이벤트를 발행합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const mbtiReadCreate = jest
        .spyOn(mbtiReadRepository, 'create')
        .mockRejectedValue(new Error('오류 발생'));
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserMbtiReadEvent(
          'CreateUserMbtiReadEvent',
          'save',
          command.userId,
          command.mbti,
          command.toUserId,
          command.createdAt,
        ),
        manager,
      );
      expect(mbtiReadCreate).toBeCalledTimes(1);
      expect(mbtiReadCreate).toBeCalledWith(
        new CreateMbtiReadDto(
          command.mbtiId,
          command.userId,
          command.mbti,
          command.toUserId,
          command.createdAt,
        ),
        readManager,
      );
      expect(eventBusPublish).toBeCalledTimes(1);
      expect(eventBusPublish).toBeCalledWith(
        new DeleteUserMbtiEvent(
          'DeleteUserMbtiEvent',
          'delete',
          command.userId,
          command.mbtiId,
        ),
      );
    });
  });
});
