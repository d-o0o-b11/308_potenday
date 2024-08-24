import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUserBalanceEvent, CreateUserExpressionEvent } from '../event';
import {
  CreateUserBalanceReadCommand,
  CreateUserExpressionReadCommand,
} from '../command';

@Injectable()
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
}
