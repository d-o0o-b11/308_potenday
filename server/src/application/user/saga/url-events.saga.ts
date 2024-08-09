// import { Injectable } from '@nestjs/common';
// import { Saga, ofType } from '@nestjs/cqrs';
// import { Observable } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { EventBus } from '@nestjs/cqrs';
// import { CreateUrlEvent, DeleteUrlEvent } from '../event';

// @Injectable()
// export class UrlSaga {
//   constructor(private readonly eventBus: EventBus) {}

//   @Saga()
//   handleCreateUrlEvent = (
//     events$: Observable<CreateUrlEvent>,
//   ): Observable<void> => {
//     return events$.pipe(
//       ofType(CreateUrlEvent),
//       map((event: CreateUrlEvent) => {
//         console.log('CreateUrlEvent', CreateUrlEvent);
//         try {
//           // 이벤트가 정상적으로 처리되었다면 아무 작업도 하지 않음
//         } catch (error) {
//           // 오류 발생 시 보상 작업으로 DeleteUrlEvent 발행
//           console.log('들어옴');
//           this.eventBus.publish(
//             new DeleteUrlEvent('DeleteUrlEvent', 'delete', event.urlId),
//           );
//         }
//       }),
//       catchError((error) => {
//         console.error('Error handling CreateUrlEvent:', error);
//         // 필요 시 추가적인 오류 처리
//         return [];
//       }),
//     );
//   };
// }

import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EventBus } from '@nestjs/cqrs';
import { CreateUrlEvent, DeleteUrlEvent } from '../event/event-sourcing.event';
import { UrlReadRepository } from '@infrastructure';

@Injectable()
export class UrlSaga {
  constructor(
    private readonly eventBus: EventBus,
    private readonly urlReadRepository: UrlReadRepository,
  ) {}

  @Saga()
  handleCreateUrlEvent = (
    events$: Observable<CreateUrlEvent>,
  ): Observable<void> => {
    return events$.pipe(
      ofType(CreateUrlEvent),
      map(async (event: CreateUrlEvent) => {
        try {
          // 이벤트 소싱 저장 처리
          await this.urlReadRepository.create(
            new CreateUserUrlReadDto(
              event.urlId,
              event.url,
              event.status,
              event.createdAt,
              event.updatedAt,
              event.deletedAt,
            ),
            this.readManager, // Read DB 매니저
          );
          // 성공적인 처리 후 아무 작업도 하지 않음
        } catch (error) {
          console.error('Error processing CreateUrlEvent:', error);
          // 오류 발생 시 보상 작업으로 DeleteUrlEvent 발행
          this.eventBus.publish(
            new DeleteUrlEvent(
              event.urlId, // 삭제할 URL ID
              event.url,
              event.status,
              event.createdAt,
              event.updatedAt,
              event.deletedAt,
            ),
          );
        }
      }),
      catchError((error) => {
        console.error('Error handling CreateUrlEvent in Saga:', error);
        // 필요 시 추가적인 오류 처리
        return [];
      }),
    );
  };
}
