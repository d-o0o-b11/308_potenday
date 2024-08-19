import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUrlReadCommand, UpdateUrlReadStatusCommand } from '../command';
import { CreateUrlEvent, UpdateUrlStatusEvent } from '../event';

@Injectable()
export class UrlSaga {
  @Saga()
  handleCreateUrlEvent = (
    events$: Observable<CreateUrlEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreateUrlEvent),
      map(
        (event: CreateUrlEvent) =>
          new CreateUrlReadCommand(
            event.urlId,
            event.url,
            event.status,
            event.createdAt,
            event.updatedAt,
            event.deletedAt,
          ),
      ),
    );
  };

  @Saga()
  handleUpdateUrlStatusEvent = (
    events$: Observable<UpdateUrlStatusEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(UpdateUrlStatusEvent),
      map(
        (event: UpdateUrlStatusEvent) =>
          new UpdateUrlReadStatusCommand(event.urlId, event.status),
      ),
    );
  };
}
