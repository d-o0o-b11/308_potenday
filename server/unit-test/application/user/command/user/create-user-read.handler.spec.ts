import {
  CreateUserReadCommand,
  CreateUserReadCommandHandler,
  CreateUserReadDto,
  CreateUserReadEvent,
  DeleteUserEvent,
  UpdateUserIdDto,
} from '@application';
import {
  IEventRepository,
  IUrlReadRepository,
  IUserReadRepository,
} from '@domain';
import {
  EVENT_REPOSITORY_TOKEN,
  URL_READ_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('CreateUserReadCommandHandler', () => {
  let handler: CreateUserReadCommandHandler;
  let userReadRepository: IUserReadRepository;
  let urlReadRepository: IUrlReadRepository;
  let eventRepository: IEventRepository;
  let eventBus: EventBus;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserReadCommandHandler,
        {
          provide: USER_READ_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: URL_READ_REPOSITORY_TOKEN,
          useValue: {
            updateUserList: jest.fn(),
          },
        },
        {
          provide: EVENT_REPOSITORY_TOKEN,
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

    handler = module.get<CreateUserReadCommandHandler>(
      CreateUserReadCommandHandler,
    );
    userReadRepository = module.get<IUserReadRepository>(
      USER_READ_REPOSITORY_TOKEN,
    );
    urlReadRepository = module.get<IUrlReadRepository>(
      URL_READ_REPOSITORY_TOKEN,
    );
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    eventBus = module.get<EventBus>(EventBus);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(userReadRepository).toBeDefined();
    expect(urlReadRepository).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserReadCommand(
      126,
      1,
      'd_o0o_b',
      111,
      new Date('2024-09-01'),
      null,
      null,
    );

    it('유저를 Read DB에 저장합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const userCreate = jest.spyOn(userReadRepository, 'create');
      const updateUserList = jest.spyOn(urlReadRepository, 'updateUserList');
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserReadEvent(
          'CreateUserReadCommand',
          'save',
          command.userId,
          command.imgId,
          command.name,
          command.urlId,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        manager,
      );
      expect(userCreate).toBeCalledTimes(1);
      expect(userCreate).toBeCalledWith(
        new CreateUserReadDto(
          command.userId,
          command.imgId,
          command.name,
          command.urlId,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        readManager,
      );
      expect(updateUserList).toBeCalledTimes(1);
      expect(updateUserList).toBeCalledWith(
        new UpdateUserIdDto(command.urlId, command.userId),
        readManager,
      );
      expect(eventBusPublish).toBeCalledTimes(0);
    });

    it('유저를 Read DB에 저장하는 과정에서 오류가 발생하여 rollback 이벤트를 발행합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const userCreate = jest
        .spyOn(userReadRepository, 'create')
        .mockRejectedValue(new Error('오류 발생'));
      const updateUserList = jest.spyOn(urlReadRepository, 'updateUserList');
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUserReadEvent(
          'CreateUserReadCommand',
          'save',
          command.userId,
          command.imgId,
          command.name,
          command.urlId,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        manager,
      );
      expect(userCreate).toBeCalledTimes(1);
      expect(userCreate).toBeCalledWith(
        new CreateUserReadDto(
          command.userId,
          command.imgId,
          command.name,
          command.urlId,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        readManager,
      );
      expect(updateUserList).toBeCalledTimes(0);
      expect(eventBusPublish).toBeCalledTimes(1);
      expect(eventBusPublish).toBeCalledWith(
        new DeleteUserEvent(
          'DeleteUserEvent',
          'delete',
          command.userId,
          command.userId,
        ),
      );
    });
  });
});
