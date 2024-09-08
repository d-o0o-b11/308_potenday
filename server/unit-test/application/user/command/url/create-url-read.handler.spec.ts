import {
  CreateUrlReadCommand,
  CreateUrlReadCommandHandler,
  CreateUrlReadEvent,
  CreateUserUrlReadDto,
  DeleteUrlEvent,
} from '@application';
import { IEventRepository, IUrlReadRepository } from '@domain';
import {
  EVENT_REPOSITORY_TOKEN,
  URL_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('CreateUrlReadCommandHandler', () => {
  let handler: CreateUrlReadCommandHandler;
  let urlReadRepository: IUrlReadRepository;
  let eventRepository: IEventRepository;
  let eventBus: EventBus;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUrlReadCommandHandler,
        {
          provide: URL_READ_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
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

    handler = module.get<CreateUrlReadCommandHandler>(
      CreateUrlReadCommandHandler,
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
    expect(urlReadRepository).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUrlReadCommand(
      111,
      'TEST_URL',
      true,
      new Date('2024-09-01'),
      null,
      null,
    );

    it('url을 Read DB에 저장합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const urlReadCreate = jest.spyOn(urlReadRepository, 'create');
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUrlReadEvent(
          'CreateUrlReadCommand',
          'save',
          command.urlId,
          command.url,
          command.status,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        manager,
      );
      expect(urlReadCreate).toBeCalledTimes(1);
      expect(urlReadCreate).toBeCalledWith(
        new CreateUserUrlReadDto(
          command.urlId,
          command.url,
          command.status,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        readManager,
      );
      expect(eventPublish).toBeCalledTimes(0);
    });

    it('url을 Read DB에 저장하는 과정에서 오류가 발생할 경우 rollback 이벤트를 발행합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const urlReadCreate = jest
        .spyOn(urlReadRepository, 'create')
        .mockRejectedValue(new Error('오류 발생'));
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(
        new CreateUrlReadEvent(
          'CreateUrlReadCommand',
          'save',
          command.urlId,
          command.url,
          command.status,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        manager,
      );
      expect(urlReadCreate).toBeCalledTimes(1);
      expect(urlReadCreate).toBeCalledWith(
        new CreateUserUrlReadDto(
          command.urlId,
          command.url,
          command.status,
          command.createdAt,
          command.updatedAt,
          command.deletedAt,
        ),
        readManager,
      );
      expect(eventPublish).toBeCalledTimes(1);
      expect(eventPublish).toBeCalledWith(
        new DeleteUrlEvent('DeleteUrlEvent', 'delete', command.urlId),
      );
    });
  });
});
