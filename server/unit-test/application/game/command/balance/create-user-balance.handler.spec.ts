import {
  CountUsersInRoomQuery,
  CreateUserBalanceCommand,
  CreateUserBalanceCommandHandler,
  CreateUserBalanceEvent,
  GameNextEvent,
} from '@application';
import { BALANCE_SERVICE_TOKEN } from '@infrastructure';
import { IBalanceService } from '@interface';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateUserBalanceCommandHandler', () => {
  let handler: CreateUserBalanceCommandHandler;
  let queryBus: QueryBus;
  let eventBus: EventBus;
  let balanceService: IBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserBalanceCommandHandler,
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: EventBus,
          useValue: { publish: jest.fn() },
        },
        {
          provide: BALANCE_SERVICE_TOKEN,
          useValue: {
            saveUserExpressionAndGetSubmitCount: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateUserBalanceCommandHandler>(
      CreateUserBalanceCommandHandler,
    );
    queryBus = module.get<QueryBus>(QueryBus);
    eventBus = module.get<EventBus>(EventBus);
    balanceService = module.get<IBalanceService>(BALANCE_SERVICE_TOKEN);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(queryBus).toBeDefined();
    expect(eventBus).toBeDefined();
    expect(balanceService).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserBalanceCommand(111, 126, 3, 'B');

    const submitList = {
      submitCount: 2,
      saveResult: {
        getUserId: () => 13,
        getBalanceId: () => 3,
        getBalanceType: () => 'B',
        getCreatedAt: () => new Date('2024-08-29'),
      } as any,
    };

    const submitListEqual = {
      submitCount: 3,
      saveResult: {
        getUserId: () => 13,
        getBalanceId: () => 3,
        getBalanceType: () => 'B',
        getCreatedAt: () => new Date('2024-08-29'),
      } as any,
    };

    const userCount = {
      userCount: 4,
    };

    it('형용사 표현을 저장합니다., 제출 인원이 url 인원 수 보다 1 이상 작을 경우 void를 반환합니다.', async () => {
      const saveUserExpressionAndGetSubmitCount = jest
        .spyOn(balanceService, 'saveUserExpressionAndGetSubmitCount')
        .mockResolvedValue(submitList);
      const queryBusExecute = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userCount);
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(saveUserExpressionAndGetSubmitCount).toBeCalledTimes(1);
      expect(saveUserExpressionAndGetSubmitCount).toBeCalledWith({
        userId: command.userId,
        balanceId: command.balanceId,
        balanceType: command.balanceType,
        urlId: command.urlId,
      });
      expect(queryBusExecute).toBeCalledTimes(1);
      expect(queryBusExecute).toBeCalledWith(
        new CountUsersInRoomQuery(command.urlId),
      );
      expect(eventBusPublish).toBeCalledTimes(1);
      expect(eventBusPublish).toBeCalledWith(
        new CreateUserBalanceEvent(
          submitList.saveResult.getUserId(),
          submitList.saveResult.getBalanceId(),
          submitList.saveResult.getBalanceType(),
          submitList.saveResult.getCreatedAt(),
        ),
      );
    });

    it('형용사 표현을 저장합니다., 제출 인원이 url 인원 수 보다 1만큼 클 경우 GameNextEvent 를 발행합니다.', async () => {
      const saveUserExpressionAndGetSubmitCount = jest
        .spyOn(balanceService, 'saveUserExpressionAndGetSubmitCount')
        .mockResolvedValue(submitListEqual);
      const queryBusExecute = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userCount);
      const eventBusPublish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(saveUserExpressionAndGetSubmitCount).toBeCalledTimes(1);
      expect(saveUserExpressionAndGetSubmitCount).toBeCalledWith({
        userId: command.userId,
        balanceId: command.balanceId,
        balanceType: command.balanceType,
        urlId: command.urlId,
      });
      expect(queryBusExecute).toBeCalledTimes(1);
      expect(queryBusExecute).toBeCalledWith(
        new CountUsersInRoomQuery(command.urlId),
      );
      expect(eventBusPublish).toBeCalledTimes(2);
      expect(eventBusPublish).toHaveBeenNthCalledWith(
        1,
        new CreateUserBalanceEvent(
          submitListEqual.saveResult.getUserId(),
          submitListEqual.saveResult.getBalanceId(),
          submitListEqual.saveResult.getBalanceType(),
          submitListEqual.saveResult.getCreatedAt(),
        ),
      );
      expect(eventBusPublish).toHaveBeenNthCalledWith(
        2,
        new GameNextEvent('BalanceGameNextEvent', 'event', command.urlId),
      );
    });
  });
});
