import {
  CreateUserCommand,
  CreateUserDto,
  CreateUserEvent,
  CreateUserHandler,
  FindOneUserUrlDto,
} from '@application';
import { MaximumUrlException, StatusFalseUrlException } from '@common';
import { IUserRepository } from '@domain';
import { URL_SERVICE_TOKEN, USER_REPOSITORY_TOKEN } from '@infrastructure';
import { IUrlService } from '@interface';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: IUserRepository;
  let urlService: IUrlService;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: URL_SERVICE_TOKEN,
          useValue: {
            checkUserLimitForUrl: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY_TOKEN);
    urlService = module.get<IUrlService>(URL_SERVICE_TOKEN);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(urlService).toBeDefined();
    expect(eventBus).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserCommand(111, 2, 'd_o0o_b');

    it('유저를 생성합니다.', async () => {
      const checkUserResult = {
        userCount: 3,
        status: true,
      } as any;
      const result = {
        getId: () => 111,
        getImgId: () => command.imgId,
        getName: () => command.name,
        getUrlId: () => command.urlId,
        getCreatedAt: () => new Date('2024-09-01'),
        getUpdatedAt: () => null,
        getDeletedAt: () => null,
      } as any;

      const checkUserLimitForUrl = jest
        .spyOn(urlService, 'checkUserLimitForUrl')
        .mockResolvedValue(checkUserResult);
      const create = jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(result);
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(checkUserLimitForUrl).toBeCalledTimes(1);
      expect(checkUserLimitForUrl).toBeCalledWith(
        new FindOneUserUrlDto(command.urlId),
      );
      expect(create).toBeCalledTimes(1);
      expect(create).toBeCalledWith(
        new CreateUserDto(command.urlId, command.imgId, command.name),
      );
      expect(eventPublish).toBeCalledTimes(1);
      expect(eventPublish).toBeCalledWith(
        new CreateUserEvent(
          result.getId(),
          result.getImgId(),
          result.getName(),
          result.getUrlId(),
          result.getCreatedAt(),
          result.getUpdatedAt(),
          result.getDeletedAt(),
        ),
      );
    });

    it('게임이 진행 중인 방에는 입장할 수 없습니다.', async () => {
      const checkUserResult = {
        userCount: 3,
        status: false,
      } as any;

      const checkUserLimitForUrl = jest
        .spyOn(urlService, 'checkUserLimitForUrl')
        .mockResolvedValue(checkUserResult);
      const create = jest.spyOn(userRepository, 'create');
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await expect(handler.execute(command)).rejects.toThrow(
        new StatusFalseUrlException(),
      );

      expect(checkUserLimitForUrl).toBeCalledTimes(1);
      expect(checkUserLimitForUrl).toBeCalledWith(
        new FindOneUserUrlDto(command.urlId),
      );
      expect(create).toBeCalledTimes(0);
      expect(eventPublish).toBeCalledTimes(0);
    });

    it('해당 url에 인원수가 4명 이상일 경우 입장할 수 없습니다.', async () => {
      const checkUserResult = {
        userCount: 4,
        status: true,
      } as any;

      const checkUserLimitForUrl = jest
        .spyOn(urlService, 'checkUserLimitForUrl')
        .mockResolvedValue(checkUserResult);
      const create = jest.spyOn(userRepository, 'create');
      const eventPublish = jest.spyOn(eventBus, 'publish');

      await expect(handler.execute(command)).rejects.toThrow(
        new MaximumUrlException(),
      );

      expect(checkUserLimitForUrl).toBeCalledTimes(1);
      expect(checkUserLimitForUrl).toBeCalledWith(
        new FindOneUserUrlDto(command.urlId),
      );
      expect(create).toBeCalledTimes(0);
      expect(eventPublish).toBeCalledTimes(0);
    });
  });
});
