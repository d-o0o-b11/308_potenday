import {
  CreateUserAdjectiveExpressionReadDto,
  CreateUserExpressionReadCommand,
  CreateUserExpressionReadCommandHandler,
  CreateUserExpressionReadEvent,
  DeleteUserExpressionEvent,
} from '@application';
import {
  IAdjectiveExpressionRepositoryReadRepository,
  IEventRepository,
} from '@domain';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  EVENT_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('CreateUserExpressionReadCommandHandler', () => {
  let handler: CreateUserExpressionReadCommandHandler;
  let adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository;
  let eventRepository: IEventRepository;
  let eventBus: EventBus;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserExpressionReadCommandHandler,
        {
          provide: ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
          useValue: { create: jest.fn() },
        },
        {
          provide: EVENT_REPOSITORY_TOKEN,
          useValue: { create: jest.fn() },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
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

    handler = module.get<CreateUserExpressionReadCommandHandler>(
      CreateUserExpressionReadCommandHandler,
    );
    adjectiveExpressionReadRepository =
      module.get<IAdjectiveExpressionRepositoryReadRepository>(
        ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
      );
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    eventBus = module.get<EventBus>(EventBus);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(adjectiveExpressionReadRepository).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserExpressionReadCommand(
      126,
      [1, 3, 7],
      new Date('2024-08-29'),
    );

    it('형용사 표현 Read DB/event log 를 저장합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const adjectiveExpressionCreate = jest.spyOn(
        adjectiveExpressionReadRepository,
        'create',
      );
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserExpressionReadEvent(
          'CreateUserExpressionReadCommand',
          'save',
          command.userId,
          command.adjectiveExpressionIdList,
        ),
        manager,
      );
      expect(adjectiveExpressionCreate).toBeCalledTimes(1);
      expect(adjectiveExpressionCreate).toBeCalledWith(
        new CreateUserAdjectiveExpressionReadDto(
          command.userId,
          command.adjectiveExpressionIdList,
          command.createdAt,
        ),
        readManager,
      );
      expect(eventBusPublish).toBeCalledTimes(0);
    });

    it('형용사 표현 저장 시 오류 발생할 경우 DeleteUserExpressionEvent를 태웁니다.', async () => {
      const eventCreate = jest
        .spyOn(eventRepository, 'create')
        .mockRejectedValue(new Error('오류 발생'));
      const adjectiveExpressionCreate = jest.spyOn(
        adjectiveExpressionReadRepository,
        'create',
      );
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserExpressionReadEvent(
          'CreateUserExpressionReadCommand',
          'save',
          command.userId,
          command.adjectiveExpressionIdList,
        ),
        manager,
      );
      expect(adjectiveExpressionCreate).toBeCalledTimes(0);
      expect(eventBusPublish).toBeCalledTimes(1);
      expect(eventBusPublish).toBeCalledWith(
        new DeleteUserExpressionEvent(
          'DeleteUserExpressionEvent',
          'delete',
          command.userId,
        ),
      );
    });
  });
});
