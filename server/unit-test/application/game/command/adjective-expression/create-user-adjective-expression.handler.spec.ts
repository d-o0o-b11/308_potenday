import {
  CountUsersInRoomQuery,
  CreateUserAdjectiveExpressionCommand,
  CreateUserAdjectiveExpressionHandler,
  CreateUserExpressionEvent,
  GameNextEvent,
} from '@application';
import { ADJECTIVE_EXPRESSION_SERVICE_TOKEN } from '@infrastructure';
import { IAdjectiveExpressionService } from '@interface';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

describe('CreateUserAdjectiveExpressionHandler', () => {
  let handler: CreateUserAdjectiveExpressionHandler;
  let adjectiveExpressionService: IAdjectiveExpressionService;
  let queryBus: QueryBus;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserAdjectiveExpressionHandler,
        {
          provide: ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
          useValue: {
            saveUserExpressionAndGetSubmitCount: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
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

    handler = module.get<CreateUserAdjectiveExpressionHandler>(
      CreateUserAdjectiveExpressionHandler,
    );
    adjectiveExpressionService = module.get<IAdjectiveExpressionService>(
      ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
    );
    queryBus = module.get<QueryBus>(QueryBus);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(adjectiveExpressionService).toBeDefined();
    expect(queryBus).toBeDefined();
    expect(eventBus).toBeDefined();
  });

  describe('execute', () => {
    const command = new CreateUserAdjectiveExpressionCommand(
      11,
      126,
      [1, 3, 5],
    );

    const submitList = {
      saveResult: [
        {
          getUserId: () => 126,
          getCreatedAt: () => new Date('2024-08-29'),
          getAdjectiveExpressionId: () => 1,
        },
        {
          getUserId: () => 126,
          getCreatedAt: () => new Date('2024-08-29'),
          getAdjectiveExpressionId: () => 11,
        },
      ] as any,
      submitCount: 2,
    };

    const submitListEqual = {
      saveResult: [
        {
          getUserId: () => 126,
          getCreatedAt: () => new Date('2024-08-29'),
          getAdjectiveExpressionId: () => 1,
        },
        {
          getUserId: () => 126,
          getCreatedAt: () => new Date('2024-08-29'),
          getAdjectiveExpressionId: () => 11,
        },
      ] as any,
      submitCount: 3,
    };

    const userCount = {
      userCount: 4,
    };

    it('형용사 표현을 저장합니다., 제출 인원이 url 인원 수 보다 1 이상 작을 경우 void를 반환합니다.', async () => {
      const saveUserExpressionAndGetSubmitCount = jest
        .spyOn(
          adjectiveExpressionService,
          'saveUserExpressionAndGetSubmitCount',
        )
        .mockResolvedValue(submitList);
      const execute = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userCount);
      const publish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(saveUserExpressionAndGetSubmitCount).toBeCalledTimes(1);
      expect(saveUserExpressionAndGetSubmitCount).toBeCalledWith({
        urlId: command.urlId,
        userId: command.userId,
        expressionIdList: command.expressionIdList,
      });
      expect(execute).toBeCalledTimes(1);
      expect(execute).toBeCalledWith(new CountUsersInRoomQuery(command.urlId));
      expect(publish).toBeCalledTimes(1);
      expect(publish).toBeCalledWith(
        new CreateUserExpressionEvent(
          submitList.saveResult[0].getUserId(),
          submitList.saveResult.map((list) => list.getAdjectiveExpressionId()),
          submitList.saveResult[0].getCreatedAt(),
        ),
      );
    });

    it('형용사 표현을 저장합니다., 제출 인원이 url 인원 수 보다 1만큼 클 경우 GameNextEvent 를 반환합니다.', async () => {
      const saveUserExpressionAndGetSubmitCount = jest
        .spyOn(
          adjectiveExpressionService,
          'saveUserExpressionAndGetSubmitCount',
        )
        .mockResolvedValue(submitListEqual);
      const execute = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue(userCount);
      const publish = jest.spyOn(eventBus, 'publish');

      await handler.execute(command);

      expect(saveUserExpressionAndGetSubmitCount).toBeCalledTimes(1);
      expect(saveUserExpressionAndGetSubmitCount).toBeCalledWith({
        urlId: command.urlId,
        userId: command.userId,
        expressionIdList: command.expressionIdList,
      });
      expect(execute).toBeCalledTimes(1);
      expect(execute).toBeCalledWith(new CountUsersInRoomQuery(command.urlId));
      expect(publish).toBeCalledTimes(2);
      expect(publish).toHaveBeenNthCalledWith(
        1,
        new CreateUserExpressionEvent(
          submitListEqual.saveResult[0].getUserId(),
          submitListEqual.saveResult.map((list) =>
            list.getAdjectiveExpressionId(),
          ),
          submitListEqual.saveResult[0].getCreatedAt(),
        ),
      );
      expect(publish).toHaveBeenNthCalledWith(
        2,
        new GameNextEvent(
          'AdjectiveExpressionGameNextEvent',
          'event',
          command.urlId,
        ),
      );
    });
  });
});
