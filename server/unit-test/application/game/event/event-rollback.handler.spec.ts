import {
  DeleteUserBalanceDto,
  DeleteUserBalanceEvent,
  DeleteUserBalanceReadDto,
  DeleteUserExpressionEvent,
  DeleteUserMbtiEvent,
  DeleteUserMbtiReadDto,
  EventGameRollbackHandler,
} from '@application';
import { SlackService } from '@common';
import {
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryReadRepository,
  IBalanceReadRepository,
  IBalanceRepository,
  IEventRepository,
  IMbtiReadRepository,
  IMbtiRepository,
} from '@domain';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  BALANCE_READ_REPOSITORY_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
  EVENT_REPOSITORY_TOKEN,
  MBTI_REPOSITORY_READ_TOKEN,
  MBTI_REPOSITORY_TOKEN,
} from '@infrastructure';
import { MockEntityManager } from '@mock';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

describe('EventGameRollbackHandler', () => {
  let handler: EventGameRollbackHandler;
  let eventRepository: IEventRepository;
  let adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository;
  let adjectiveExpressionRepository: IAdjectiveExpressionRepository;
  let balanceReadRepository: IBalanceReadRepository;
  let balanceRepository: IBalanceRepository;
  let mbtiReadRepository: IMbtiReadRepository;
  let mbtiRepository: IMbtiRepository;
  let manager: EntityManager;
  let readManager: EntityManager;
  let slackService: SlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventGameRollbackHandler,
        {
          provide: EVENT_REPOSITORY_TOKEN,
          useValue: { create: jest.fn() },
        },
        {
          provide: ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
          useValue: { delete: jest.fn() },
        },
        {
          provide: ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
          useValue: { delete: jest.fn() },
        },
        {
          provide: BALANCE_READ_REPOSITORY_TOKEN,
          useValue: { delete: jest.fn() },
        },
        {
          provide: BALANCE_REPOSITORY_TOKEN,
          useValue: { delete: jest.fn() },
        },
        {
          provide: MBTI_REPOSITORY_READ_TOKEN,
          useValue: { delete: jest.fn() },
        },
        {
          provide: MBTI_REPOSITORY_TOKEN,
          useValue: { delete: jest.fn() },
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

    handler = module.get<EventGameRollbackHandler>(EventGameRollbackHandler);
    eventRepository = module.get<IEventRepository>(EVENT_REPOSITORY_TOKEN);
    adjectiveExpressionReadRepository =
      module.get<IAdjectiveExpressionRepositoryReadRepository>(
        ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
      );
    adjectiveExpressionRepository = module.get<IAdjectiveExpressionRepository>(
      ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
    );
    balanceReadRepository = module.get<IBalanceReadRepository>(
      BALANCE_READ_REPOSITORY_TOKEN,
    );
    balanceRepository = module.get<IBalanceRepository>(
      BALANCE_REPOSITORY_TOKEN,
    );
    mbtiReadRepository = module.get<IMbtiReadRepository>(
      MBTI_REPOSITORY_READ_TOKEN,
    );
    mbtiRepository = module.get<IMbtiRepository>(MBTI_REPOSITORY_TOKEN);
    manager = module.get<EntityManager>(getEntityManagerToken());
    readManager = module.get<EntityManager>(getEntityManagerToken('read'));
    slackService = module.get<SlackService>(SlackService);
  });

  it('IsDefined', () => {
    expect(handler).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(adjectiveExpressionReadRepository).toBeDefined();
    expect(adjectiveExpressionRepository).toBeDefined();
    expect(balanceReadRepository).toBeDefined();
    expect(balanceRepository).toBeDefined();
    expect(mbtiReadRepository).toBeDefined();
    expect(mbtiRepository).toBeDefined();
    expect(manager).toBeDefined();
    expect(readManager).toBeDefined();
    expect(slackService).toBeDefined();
  });

  describe('event: DeleteUserExpressionEvent', () => {
    const event = new DeleteUserExpressionEvent(
      'DeleteUserExpressionEvent',
      'delete',
      111,
    );

    it('형용사 표현 데이터를 롤백합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const adjectiveExpressionReadDelete = jest.spyOn(
        adjectiveExpressionReadRepository,
        'delete',
      );
      const adjectiveExpressionDelete = jest.spyOn(
        adjectiveExpressionRepository,
        'delete',
      );

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(adjectiveExpressionReadDelete).toBeCalledTimes(1);
      expect(adjectiveExpressionReadDelete).toBeCalledWith(
        event.urlId,
        readManager,
      );
      expect(adjectiveExpressionDelete).toBeCalledTimes(1);
      expect(adjectiveExpressionDelete).toBeCalledWith(event.urlId, manager);
    });

    it('형용사 표현 데이터 롤백 과정에서 오류가 발생할 경우 슬랙을 보냅니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const adjectiveExpressionReadDelete = jest
        .spyOn(adjectiveExpressionReadRepository, 'delete')
        .mockRejectedValue(new Error('오류 발생'));
      const adjectiveExpressionDelete = jest.spyOn(
        adjectiveExpressionRepository,
        'delete',
      );
      const sendErrorMessage = jest.spyOn(slackService, 'sendErrorMessage');

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(adjectiveExpressionReadDelete).toBeCalledTimes(1);
      expect(adjectiveExpressionReadDelete).toBeCalledWith(
        event.urlId,
        readManager,
      );
      expect(adjectiveExpressionDelete).toBeCalledTimes(0);
      expect(sendErrorMessage).toBeCalledTimes(1);
    });
  });

  describe('event: DeleteUserBalanceEvent', () => {
    const event = new DeleteUserBalanceEvent(
      'DeleteUserBalanceEvent',
      'delete',
      126,
      2,
    );

    it('밸런스 데이터를 롤백합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const balanceReadDelete = jest.spyOn(balanceReadRepository, 'delete');
      const balanceDelete = jest.spyOn(balanceRepository, 'delete');

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(balanceReadDelete).toBeCalledTimes(1);
      expect(balanceReadDelete).toBeCalledWith(
        new DeleteUserBalanceReadDto(event.userId, event.balanceId),
        readManager,
      );
      expect(balanceDelete).toBeCalledTimes(1);
      expect(balanceDelete).toBeCalledWith(
        new DeleteUserBalanceDto(event.userId, event.balanceId),
        manager,
      );
    });

    it('밸런스 데이터 롤백 과정에서 오류가 발생할 경우 슬랙을 보냅니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const balanceReadDelete = jest.spyOn(balanceReadRepository, 'delete');
      const balanceDelete = jest
        .spyOn(balanceRepository, 'delete')
        .mockRejectedValue(new Error('오류 발생'));
      const sendErrorMessage = jest.spyOn(slackService, 'sendErrorMessage');

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(balanceReadDelete).toBeCalledTimes(1);
      expect(balanceReadDelete).toBeCalledWith(
        new DeleteUserBalanceReadDto(event.userId, event.balanceId),
        readManager,
      );
      expect(balanceDelete).toBeCalledTimes(1);
      expect(balanceDelete).toBeCalledWith(
        new DeleteUserBalanceDto(event.userId, event.balanceId),
        manager,
      );
      expect(sendErrorMessage).toBeCalledTimes(1);
    });
  });

  describe('event: DeleteUserMbtiEvent', () => {
    const event = new DeleteUserMbtiEvent(
      'DeleteUserMbtiEvent',
      'delete',
      126,
      134,
    );

    it('mbti 데이터를 롤백합니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const mbtiReadDelete = jest.spyOn(mbtiReadRepository, 'delete');
      const mbtiDelete = jest.spyOn(mbtiRepository, 'delete');

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(mbtiReadDelete).toBeCalledTimes(1);
      expect(mbtiReadDelete).toBeCalledWith(
        new DeleteUserMbtiReadDto(event.mbtiId, event.userId),
        readManager,
      );
      expect(mbtiDelete).toBeCalledTimes(1);
      expect(mbtiDelete).toBeCalledWith(event.mbtiId, manager);
    });

    it('mbti 데이터 롤백 과정에서 오류가 발생할 경우 슬랙을 보냅니다.', async () => {
      const eventCreate = jest.spyOn(eventRepository, 'create');
      const mbtiReadDelete = jest
        .spyOn(mbtiReadRepository, 'delete')
        .mockRejectedValue(new Error('오류 발생'));
      const mbtiDelete = jest.spyOn(mbtiRepository, 'delete');
      const sendErrorMessage = jest.spyOn(slackService, 'sendErrorMessage');

      await handler.handle(event);

      expect(eventCreate).toBeCalledTimes(1);
      expect(eventCreate).toBeCalledWith(event, manager);
      expect(mbtiReadDelete).toBeCalledTimes(1);
      expect(mbtiReadDelete).toBeCalledWith(
        new DeleteUserMbtiReadDto(event.mbtiId, event.userId),
        readManager,
      );
      expect(mbtiDelete).toBeCalledTimes(0);
      expect(sendErrorMessage).toBeCalledTimes(1);
    });
  });
});
