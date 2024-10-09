import {
  DeleteUpdateUrlStatusEvent,
  DeleteUrlEvent,
  DeleteUserEvent,
  DeleteUserIdDto,
  EventRollbackHandler,
  UpdateUserUrlDto,
  UpdateUserUrlStatusDto,
} from '@application';
import { SlackService } from '@common';
import {
  IEventRepository,
  IUrlReadRepository,
  IUrlRepository,
  IUserReadRepository,
  IUserRepository,
} from '@domain';
import {
  EVENT_REPOSITORY_TOKEN,
  URL_READ_REPOSITORY_TOKEN,
  URL_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('EventRollbackHandler', () => {
  let handler: EventRollbackHandler;
  let urlRepository: IUrlRepository;
  let urlReadRepository: IUrlReadRepository;
  let userReadRepository: IUserReadRepository;
  let userRepository: IUserRepository;
  let eventRepository: IEventRepository;
  let manager: EntityManager;
  let readManager: EntityManager;
  let slackService: SlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventRollbackHandler,
        {
          provide: URL_REPOSITORY_TOKEN,
          useValue: {
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: URL_READ_REPOSITORY_TOKEN,
          useValue: {
            delete: jest.fn(),
            updateStatus: jest.fn(),
            deleteUserId: jest.fn(),
          },
        },
        {
          provide: USER_READ_REPOSITORY_TOKEN,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            delete: jest.fn(),
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
        {
          provide: getEntityManagerToken('read'),
          useValue: MockEntityManager(),
        },
        {
          provide: SlackService,
          useValue: {
            sendErrorMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<EventRollbackHandler>(EventRollbackHandler);
    urlRepository = module.get<IUrlRepository>(URL_REPOSITORY_TOKEN);
    urlReadRepository = module.get<IUrlReadRepository>(
      URL_READ_REPOSITORY_TOKEN,
    );
    userReadRepository = module.get<IUserReadRepository>(
      USER_READ_REPOSITORY_TOKEN,
    );
    userRepository = module.get<IUserRepository>(USER_REPOSITORY_TOKEN);
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
    slackService = module.get<SlackService>(SlackService);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(urlRepository).toBeDefined();
    expect(urlReadRepository).toBeDefined();
    expect(userReadRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
    expect(slackService).toBeDefined();
  });

  describe('event: DeleteUrlEvent', () => {
    const event = new DeleteUrlEvent('DeleteUrlEvent', 'delete', 111);

    it('DeleteUrlEvent 이벤트 발행했을 경우 rollback 합니다.', async () => {
      const create = jest.spyOn(eventRepository, 'create');
      const urlDelete = jest.spyOn(urlRepository, 'delete');
      const urlReadDelete = jest.spyOn(urlReadRepository, 'delete');

      await handler.handle(event);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(event, manager);
      expect(urlDelete).toBeCalledTimes(1);
      expect(urlDelete).toBeCalledWith(event.urlId, manager);
      expect(urlReadDelete).toBeCalledTimes(1);
      expect(urlReadDelete).toBeCalledWith(event.urlId, readManager);
    });

    it('DeleteUrlEvent 이벤트 로직 과정에서 오류가 발생하였습니다.', async () => {
      const create = jest.spyOn(eventRepository, 'create');
      const urlDelete = jest
        .spyOn(urlRepository, 'delete')
        .mockRejectedValue(new Error('오류 발생'));
      const urlReadDelete = jest.spyOn(urlReadRepository, 'delete');
      const sendErrorMessage = jest.spyOn(slackService, 'sendErrorMessage');

      await handler.handle(event);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(event, manager);
      expect(urlDelete).toBeCalledTimes(1);
      expect(urlDelete).toBeCalledWith(event.urlId, manager);
      expect(urlReadDelete).toBeCalledTimes(0);
      expect(sendErrorMessage).toBeCalledTimes(1);
    });
  });

  describe('event: DeleteUpdateUrlStatusEvent', () => {
    const event = new DeleteUpdateUrlStatusEvent(
      'DeleteUpdateUrlStatusEvent',
      'delete',
      111,
      false,
    );

    it('DeleteUpdateUrlStatusEvent 이벤트 발행했을 경우 rollback 합니다.', async () => {
      const create = jest.spyOn(eventRepository, 'create');
      const urlUpdate = jest.spyOn(urlRepository, 'update');
      const updateStatus = jest.spyOn(urlReadRepository, 'updateStatus');

      await handler.handle(event);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(event, manager);
      expect(urlUpdate).toBeCalledTimes(1);
      expect(urlUpdate).toBeCalledWith(
        event.urlId,
        new UpdateUserUrlDto(true),
        manager,
      );
      expect(updateStatus).toBeCalledTimes(1);
      expect(updateStatus).toBeCalledWith(
        new UpdateUserUrlStatusDto(event.urlId, true),
        readManager,
      );
    });

    it('DeleteUpdateUrlStatusEvent 이벤트 로직 과정에서 오류가 발생하였습니다.', async () => {
      const create = jest.spyOn(eventRepository, 'create');
      const urlUpdate = jest
        .spyOn(urlRepository, 'update')
        .mockRejectedValue(new Error('오류 발생'));
      const updateStatus = jest.spyOn(urlReadRepository, 'updateStatus');
      const sendErrorMessage = jest.spyOn(slackService, 'sendErrorMessage');

      await handler.handle(event);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(event, manager);
      expect(urlUpdate).toBeCalledTimes(1);
      expect(urlUpdate).toBeCalledWith(
        event.urlId,
        new UpdateUserUrlDto(true),
        manager,
      );
      expect(updateStatus).toBeCalledTimes(0);
      expect(sendErrorMessage).toBeCalledTimes(1);
    });
  });

  describe('event: DeleteUserEvent', () => {
    const event = new DeleteUserEvent('DeleteUserEvent', 'delete', 111, 126);

    it('DeleteUserEvent 이벤트 발행했을 경우 rollback 합니다.', async () => {
      const create = jest.spyOn(eventRepository, 'create');
      const userDelete = jest.spyOn(userRepository, 'delete');
      const userReadDelete = jest.spyOn(userReadRepository, 'delete');
      const deleteUserId = jest.spyOn(urlReadRepository, 'deleteUserId');

      await handler.handle(event);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(event, manager);
      expect(userDelete).toBeCalledTimes(1);
      expect(userDelete).toBeCalledWith(event.userId, manager);
      expect(userReadDelete).toBeCalledTimes(1);
      expect(userReadDelete).toBeCalledWith(event.userId, readManager);
      expect(deleteUserId).toBeCalledTimes(1);
      expect(deleteUserId).toBeCalledWith(
        event.urlId,
        new DeleteUserIdDto(event.userId),
        readManager,
      );
    });

    it('DeleteUserEvent 이벤트 로직 과정에서 오류가 발생하였습니다.', async () => {
      const create = jest
        .spyOn(eventRepository, 'create')
        .mockRejectedValue(new Error('에러 발생'));
      const userDelete = jest.spyOn(userRepository, 'delete');
      const userReadDelete = jest.spyOn(userReadRepository, 'delete');
      const deleteUserId = jest.spyOn(urlReadRepository, 'deleteUserId');
      const sendErrorMessage = jest.spyOn(slackService, 'sendErrorMessage');

      await handler.handle(event);

      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(event, manager);
      expect(userDelete).toBeCalledTimes(0);
      expect(userReadDelete).toBeCalledTimes(0);
      expect(deleteUserId).toBeCalledTimes(0);
      expect(sendErrorMessage).toBeCalledTimes(1);
    });
  });
});
