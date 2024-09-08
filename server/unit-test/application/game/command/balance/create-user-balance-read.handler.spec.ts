import {
  CreateBalanceReadDto,
  CreateUserBalanceReadCommand,
  CreateUserBalanceReadCommandHandler,
  CreateUserBalanceReadEvent,
  DeleteUserBalanceEvent,
} from '@application';
import { IBalanceReadRepository, IEventRepository } from '@domain';
import {
  BALANCE_READ_REPOSITORY_TOKEN,
  EVENT_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('CreateUserBalanceReadCommandHandler', () => {
  let handler: CreateUserBalanceReadCommandHandler;
  let eventRepository: IEventRepository;
  let balanceReadRepository: IBalanceReadRepository;
  let eventBus: EventBus;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserBalanceReadCommandHandler,
        {
          provide: EVENT_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: BALANCE_READ_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
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

    handler = module.get<CreateUserBalanceReadCommandHandler>(
      CreateUserBalanceReadCommandHandler,
    );
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    balanceReadRepository = module.get<IBalanceReadRepository>(
      BALANCE_READ_REPOSITORY_TOKEN,
    );
    eventBus = module.get<EventBus>(EventBus);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(balanceReadRepository).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserBalanceReadCommand(
      126,
      2,
      'A',
      new Date('2024-08-29'),
    );

    it('형용사 표현 Read DB에 저장합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const balanceReadCreate = jest.spyOn(balanceReadRepository, 'create');
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserBalanceReadEvent(
          'CreateUserBalanceReadEvent',
          'save',
          command.userId,
          command.balanceId,
          command.balanceType,
          command.createdAt,
        ),
        manager,
      );
      expect(balanceReadCreate).toBeCalledTimes(1);
      expect(balanceReadCreate).toBeCalledWith(
        new CreateBalanceReadDto(
          command.userId,
          command.balanceId,
          command.balanceType,
          command.createdAt,
        ),
        readManager,
      );
      expect(eventBusPublish).toBeCalledTimes(0);
    });

    it('형용사 표현 Read DB 저장 오류 발생할 경우 DeleteUserBalanceEvent를 발행합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const balanceReadCreate = jest
        .spyOn(balanceReadRepository, 'create')
        .mockRejectedValue(new Error('오류 발생'));
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserBalanceReadEvent(
          'CreateUserBalanceReadEvent',
          'save',
          command.userId,
          command.balanceId,
          command.balanceType,
          command.createdAt,
        ),
        manager,
      );
      expect(balanceReadCreate).toBeCalledTimes(1);
      expect(balanceReadCreate).toBeCalledWith(
        new CreateBalanceReadDto(
          command.userId,
          command.balanceId,
          command.balanceType,
          command.createdAt,
        ),
        readManager,
      );
      expect(eventBusPublish).toBeCalledTimes(1);
      expect(eventBusPublish).toBeCalledWith(
        new DeleteUserBalanceEvent(
          'DeleteUserBalanceEvent',
          'delete',
          command.userId,
          command.balanceId,
        ),
      );
    });
  });
});
