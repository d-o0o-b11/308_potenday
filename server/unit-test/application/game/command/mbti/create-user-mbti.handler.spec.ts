import {
  CountUsersInRoomQuery,
  CreateUserMbtiCommand,
  CreateUserMbtiCommandHandler,
  CreateUserMbtiEvent,
  GameNextEvent,
  SaveUserMbtiDto,
} from '@application';
import { MBTI_SERVICE_TOKEN } from '@infrastructure';
import { IMbtiService } from '@interface';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateUserMbtiCommandHandler', () => {
  let handler: CreateUserMbtiCommandHandler;
  let queryBus: QueryBus;
  let eventBus: EventBus;
  let mbtiService: IMbtiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserMbtiCommandHandler,
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
        {
          provide: MBTI_SERVICE_TOKEN,
          useValue: { saveUserMbtiAndGetSubmitCount: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get<CreateUserMbtiCommandHandler>(
      CreateUserMbtiCommandHandler,
    );
    queryBus = module.get<QueryBus>(QueryBus);
    eventBus = module.get<EventBus>(EventBus);
    mbtiService = module.get<IMbtiService>(MBTI_SERVICE_TOKEN);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(queryBus).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(mbtiService).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserMbtiCommand(111, 126, 'ISTJ', 127);
    const submitList = {
      saveResult: {
        getUserId: () => 126,
        getMbti: () => 'ISTJ',
        getToUserId: () => 127,
        getId: () => 150,
        getCreatedAt: () => new Date('2024-08-29'),
      } as any,
      submitCount: 2,
    };
    const submitListEqual = {
      saveResult: {
        getUserId: () => 126,
        getMbti: () => 'ISTJ',
        getToUserId: () => 127,
        getId: () => 150,
        getCreatedAt: () => new Date('2024-08-29'),
      } as any,
      submitCount: 3,
    };
    const userCount = {
      userCount: 4,
    };

    it('mbti를 저장한다., 제출 인원이 url 인원 수 보다 1 이상 작을 경우 void를 반환합니다.', async () => {
      const saveUserMbtiAndGetSubmitCount = jest
        .spyOn(mbtiService, 'saveUserMbtiAndGetSubmitCount')
        .mockResolvedValue(submitList);
      const queryBusExecute = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userCount);
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(saveUserMbtiAndGetSubmitCount).toBeCalledTimes(1);
      expect(saveUserMbtiAndGetSubmitCount).toBeCalledWith(
        new SaveUserMbtiDto(
          command.urlId,
          command.userId,
          command.mbti,
          command.toUserId,
        ),
      );
      expect(queryBusExecute).toBeCalledTimes(1);
      expect(queryBusExecute).toBeCalledWith(
        new CountUsersInRoomQuery(command.urlId),
      );
      expect(eventBusPublish).toBeCalledTimes(1);
      expect(eventBusPublish).toBeCalledWith(
        new CreateUserMbtiEvent(
          submitList.saveResult.getUserId(),
          submitList.saveResult.getMbti(),
          submitList.saveResult.getToUserId(),
          submitList.saveResult.getId(),
          submitList.saveResult.getCreatedAt(),
        ),
      );
    });

    it('mbti를 저장한다., 제출 인원이 url 인원 수 보다 1만큼 클 경우 GameNextEvent 를 반환합니다.', async () => {
      const saveUserMbtiAndGetSubmitCount = jest
        .spyOn(mbtiService, 'saveUserMbtiAndGetSubmitCount')
        .mockResolvedValue(submitListEqual);
      const queryBusExecute = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userCount);
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(saveUserMbtiAndGetSubmitCount).toBeCalledTimes(1);
      expect(saveUserMbtiAndGetSubmitCount).toBeCalledWith(
        new SaveUserMbtiDto(
          command.urlId,
          command.userId,
          command.mbti,
          command.toUserId,
        ),
      );
      expect(queryBusExecute).toBeCalledTimes(1);
      expect(queryBusExecute).toBeCalledWith(
        new CountUsersInRoomQuery(command.urlId),
      );
      expect(eventBusPublish).toBeCalledTimes(2);
      expect(eventBusPublish).toHaveBeenNthCalledWith(
        1,
        new CreateUserMbtiEvent(
          submitListEqual.saveResult.getUserId(),
          submitListEqual.saveResult.getMbti(),
          submitListEqual.saveResult.getToUserId(),
          submitListEqual.saveResult.getId(),
          submitListEqual.saveResult.getCreatedAt(),
        ),
      );
      expect(eventBusPublish).toHaveBeenNthCalledWith(
        2,
        new GameNextEvent('MbtiGameNextEvent', 'event', command.urlId),
      );
    });
  });
});
