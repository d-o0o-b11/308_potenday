import { UrlReadRepository, UserReadRepository } from '@infrastructure';
import {
  CreateUrlEvent,
  CreateUserEvent,
  NextStepEvent,
  UpdateUrlStatusEvent,
} from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from './event.store';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CreateUserReadDto,
  CreateUserUrlReadDto,
  UpdateUserUrlStatusDto,
} from '@interface';

@EventsHandler(UpdateUrlStatusEvent, NextStepEvent, CreateUserEvent)
export class EventSourcingHandler
  implements
    IEventHandler<UpdateUrlStatusEvent | NextStepEvent | CreateUserEvent>
{
  constructor(
    private readonly urlReadRepository: UrlReadRepository,
    private readonly userReadRepository: UserReadRepository,
    private readonly eventStore: EventStore,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async handle(event: UpdateUrlStatusEvent | CreateUserEvent) {
    switch (event.constructor) {
      // case CreateUrlEvent:
      //   await this.handleCreateUrlEvent(event as CreateUrlEvent);
      //   break;
      case UpdateUrlStatusEvent:
        await this.handleUpdateUrlStatusEvent(event as UpdateUrlStatusEvent);
        break;
      case NextStepEvent:
        await this.handleNextStepEvent(event as NextStepEvent);
        break;
      case CreateUserEvent:
        await this.handleCreateUserEvent(event as CreateUserEvent);
        break;
      default:
        break;
    }
  }

  // private async handleCreateUrlEvent(event: CreateUrlEvent) {
  //   await this.readManager.transaction(async (readManager) => {
  //     /**
  //      * event로 넘어온 데이터로 Read DB에 저장하고 eventSourcing에 저장한다...
  //      * 근데 eventSourcing 먼저하고 ReadDB에 저장하는게 순서적으로도 적합하다.
  //      */

  //     //이벤트 소싱(Event Sourcing)에서는 상태를 변경하기 전에 이벤트를 저장하는 것이 일반적입니다.
  //     await this.manager.transaction(async (manager) => {
  //       this.eventStore.saveEvent(event, manager);
  //     });

  //     // throw new Error('에러 발생');

  //     this.urlReadRepository.create(
  //       new CreateUserUrlReadDto(
  //         event.urlId,
  //         event.url,
  //         event.status,
  //         event.createdAt,
  //         event.updatedAt,
  //         event.deletedAt,
  //       ),
  //       readManager,
  //     );
  //   });
  // }

  private async handleUpdateUrlStatusEvent(event: UpdateUrlStatusEvent) {
    await this.readManager.transaction(async (readManager) => {
      await this.manager.transaction(async (manager) => {
        this.eventStore.saveEvent(event, manager);
      });

      await this.urlReadRepository.updateStatus(
        event.urlId,
        new UpdateUserUrlStatusDto(event.status),
        readManager,
      );
    });
  }

  private async handleNextStepEvent(event: NextStepEvent) {
    await this.manager.transaction(async (manager) => {
      this.eventStore.saveEvent(event, manager);
    });
  }

  private async handleCreateUserEvent(event: CreateUserEvent) {
    await this.readManager.transaction(async (readManager) => {
      await this.manager.transaction(async (manager) => {
        this.eventStore.saveEvent(event, manager);
      });

      this.userReadRepository.create(
        new CreateUserReadDto(
          event.userId,
          event.imgId,
          event.nickname,
          event.urlId,
          event.createdAt,
          event.updatedAt,
          event.deletedAt,
        ),
        readManager,
      );

      this.urlReadRepository.updateUserList(
        event.urlId,
        event.userId,
        readManager,
      );
    });
  }
}
