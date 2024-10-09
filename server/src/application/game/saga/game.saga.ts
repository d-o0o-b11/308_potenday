import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateUserBalanceEvent,
  CreateUserExpressionEvent,
  CreateUserMbtiEvent,
} from '../event';
import {
  CreateUserBalanceReadCommand,
  CreateUserExpressionReadCommand,
  CreateUserMbtiReadCommand,
} from '../command';

export class GameSaga {
  @Saga()
  handleCreateUserExpressionEvent = (
    events$: Observable<CreateUserExpressionEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreateUserExpressionEvent),
      map(
        (event: CreateUserExpressionEvent) =>
          new CreateUserExpressionReadCommand(
            event.userId,
            event.adjectiveExpressionList,
            event.createdAt,
          ),
      ),
    );
  };

  @Saga()
  handleCreateUserBalanceEvent = (
    events$: Observable<CreateUserBalanceEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreateUserBalanceEvent),
      map(
        (event: CreateUserBalanceEvent) =>
          new CreateUserBalanceReadCommand(
            event.userId,
            event.balanceId,
            event.balanceType,
            event.createdAt,
          ),
      ),
    );
  };

  @Saga()
  handleCreateUserMbtiEvent = (
    events$: Observable<CreateUserMbtiEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreateUserMbtiEvent),
      map(
        (event: CreateUserMbtiEvent) =>
          new CreateUserMbtiReadCommand(
            event.userId,
            event.mbti,
            event.toUserId,
            event.mbtiId,
            event.createdAt,
          ),
      ),
    );
  };
}
