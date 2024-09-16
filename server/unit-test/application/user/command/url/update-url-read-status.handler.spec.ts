import {
  DeleteUpdateUrlStatusEvent,
  UpdateUrlReadStatusCommand,
  UpdateUrlReadStatusCommandHandler,
  UpdateUrlReadStatusEvent,
  UpdateUserUrlStatusDto,
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

describe('UpdateUrlReadStatusCommandHandler', () => {
  let handler: UpdateUrlReadStatusCommandHandler;
  let eventRepository: IEventRepository;
  let urlReadRepository: IUrlReadRepository;
  let eventBus: EventBus;
  let manager: EntityManager;
  let readManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUrlReadStatusCommandHandler,
        {
          provide: EVENT_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: URL_READ_REPOSITORY_TOKEN,
          useValue: {
            updateStatus: jest.fn(),
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

    handler = module.get<UpdateUrlReadStatusCommandHandler>(
      UpdateUrlReadStatusCommandHandler,
    );
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    urlReadRepository = module.get<IUrlReadRepository>(
      URL_READ_REPOSITORY_TOKEN,
    );
    eventBus = module.get<EventBus>(EventBus);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(urlReadRepository).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
  });

  describe('execute', () => {
    const command = new UpdateUrlReadStatusCommand(111, true);

    it('url status 변경을 Read DB에 적용합니다.', async () => {
      const create = jest.spyOn(eventRepository, 'create');
      const updateStatus = jest.spyOn(urlReadRepository, 'updateStatus');
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(
        new UpdateUrlReadStatusEvent(
          'UpdateUrlReadStatusCommand',
          'update',
          command.urlId,
          command.status,
        ),
        manager,
      );
      expect(updateStatus).toBeCalledTimes(1);
      expect(updateStatus).toBeCalledWith(
        new UpdateUserUrlStatusDto(command.urlId, command.status),
        readManager,
      );
      expect(eventPublish).toBeCalledTimes(0);
    });

    it('url status 변경 과정에서 오류가 발생할 경우 rollback 이벤트를 발행합니다.', async () => {
      const create = jest
        .spyOn(eventRepository, 'create')
        .mockRejectedValue(new Error('오류 발생'));
      const updateStatus = jest.spyOn(urlReadRepository, 'updateStatus');
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(
        new UpdateUrlReadStatusEvent(
          'UpdateUrlReadStatusCommand',
          'update',
          command.urlId,
          command.status,
        ),
        manager,
      );
      expect(updateStatus).toBeCalledTimes(0);
      expect(eventPublish).toBeCalledTimes(1);
      expect(eventPublish).toBeCalledWith(
        new DeleteUpdateUrlStatusEvent(
          'DeleteUpdateUrlStatusEvent',
          'update',
          command.urlId,
          command.status,
        ),
      );
    });
  });
});
