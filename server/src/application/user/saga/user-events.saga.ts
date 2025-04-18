import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUserReadCommand } from '../command';
import { CreateUserEvent } from '../event';

export class UserSaga {
  @Saga()
  handleCreateUserEvent = (
    events$: Observable<CreateUserEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreateUserEvent),
      map((event: CreateUserEvent) => {
        return new CreateUserReadCommand(
          event.userId,
          event.imgId,
          event.name,
          event.urlId,
          event.createdAt,
          event.updatedAt,
          event.deletedAt,
        );
      }),
    );
  };
}
