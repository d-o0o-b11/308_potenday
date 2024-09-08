import { Test, TestingModule } from '@nestjs/testing';
import { ICommand } from '@nestjs/cqrs';
import {
  CreateUserBalanceEvent,
  CreateUserBalanceReadCommand,
  CreateUserExpressionEvent,
  CreateUserExpressionReadCommand,
  CreateUserMbtiEvent,
  CreateUserMbtiReadCommand,
  GameSaga,
} from '@application';
import { of } from 'rxjs';

describe('GameSaga', () => {
  let saga: GameSaga;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameSaga],
    }).compile();

    saga = module.get<GameSaga>(GameSaga);
  });

  it('IsDefined', () => {
    expect(saga).toBeDefined();
  });

  describe('handleCreateUserExpressionEvent', () => {
    const event = new CreateUserExpressionEvent(
      111,
      [1, 3, 11],
      new Date(Date.now()),
    );

    it('CreateUserExpressionEvent 이벤트가 발행될 경우 CreateUserExpressionReadCommand를 실행시킵니다.', () => {
      const events$ = of(event);

      const result = saga.handleCreateUserExpressionEvent(events$);

      result.subscribe((command: ICommand) => {
        expect(command).toBeInstanceOf(CreateUserExpressionReadCommand);
        expect(command).toEqual(
          new CreateUserExpressionReadCommand(
            event.userId,
            event.adjectiveExpressionList,
            event.createdAt,
          ),
        );
      });
    });
  });

  describe('handleCreateUserBalanceEvent', () => {
    const event = new CreateUserBalanceEvent(111, 4, 'A', new Date(Date.now()));

    it('CreateUserBalanceEvent 이벤트가 발행될 경우 CreateUserBalanceReadCommand를 실행시킵니다.', (done) => {
      const events$ = of(event);

      const result = saga.handleCreateUserBalanceEvent(events$);

      result.subscribe((command: ICommand) => {
        expect(command).toBeInstanceOf(CreateUserBalanceReadCommand);
        expect(command).toEqual(
          new CreateUserBalanceReadCommand(
            event.userId,
            event.balanceId,
            event.balanceType,
            event.createdAt,
          ),
        );
        done();
      });
    });
  });

  describe('handleCreateUserMbtiEvent', () => {
    const event = new CreateUserMbtiEvent(
      126,
      'INFP',
      127,
      33,
      new Date(Date.now()),
    );

    it('CreateUserMbtiEvent 이벤트가 발행될 경우 CreateUserMbtiReadCommand를 실행시킵니다.', (done) => {
      const events$ = of(event);

      const result = saga.handleCreateUserMbtiEvent(events$);

      result.subscribe((command: ICommand) => {
        expect(command).toBeInstanceOf(CreateUserMbtiReadCommand);
        expect(command).toEqual(
          new CreateUserMbtiReadCommand(
            event.userId,
            event.mbti,
            event.toUserId,
            event.mbtiId,
            event.createdAt,
          ),
        );
        done();
      });
    });
  });
});
