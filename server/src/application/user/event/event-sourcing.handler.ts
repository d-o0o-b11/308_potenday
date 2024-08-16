import { UrlReadRepository, UserReadRepository } from '@infrastructure';
import {
  CreateUserEvent,
  NextStepEvent,
  UpdateUrlStatusEvent,
  CreateUrlReadEvent,
  DeleteUrlEvent,
} from './event-sourcing.event';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from './event.store';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CreateUserReadDto,
  CreateUserUrlReadDto,
  UpdateUserUrlStatusDto,
} from '@interface';

@EventsHandler(
  UpdateUrlStatusEvent,
  NextStepEvent,
  CreateUserEvent,
  // CreateUrlReadEvent,
)
export class EventSourcingHandler implements IEventHandler<NextStepEvent> {
  constructor(
    private readonly urlReadRepository: UrlReadRepository,
    private readonly userReadRepository: UserReadRepository,
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async handle(event: NextStepEvent) {
    switch (event.constructor) {
      // case UpdateUrlStatusEvent:
      //   await this.handleUpdateUrlStatusEvent(event as UpdateUrlStatusEvent);
      //   break;
      case NextStepEvent:
        await this.handleNextStepEvent(event as NextStepEvent);
        break;
      // case CreateUserEvent:
      //   await this.handleCreateUserEvent(event as CreateUserEvent);
      //   break;
      // case CreateUrlReadEvent:
      //   await this.handleCreateUrlReadEvent(event as CreateUrlReadEvent);
      //   break;
      default:
        break;
    }
  }

  // private async handleCreateUrlReadEvent(event: CreateUrlReadEvent) {
  //   try {
  //     this.eventStore.saveEvent(event, this.manager);
  //     this.urlReadRepository.create(
  //       new CreateUserUrlReadDto(
  //         event.urlId,
  //         event.url,
  //         event.status,
  //         event.createdAt,
  //         event.updatedAt,
  //         event.deletedAt,
  //       ),
  //       this.readManager,
  //     );
  //   } catch (error) {
  //     this.eventBus.publish(
  //       new DeleteUrlEvent('DeleteUrlEvent', 'delete', event.urlId),
  //     );
  //   }
  // }

  // private async handleUpdateUrlStatusEvent(event: UpdateUrlStatusEvent) {
  //   await this.readManager.transaction(async (readManager) => {
  //     await this.manager.transaction(async (manager) => {
  //       this.eventStore.saveEvent(event, manager);
  //     });

  //     await this.urlReadRepository.updateStatus(
  //       event.urlId,
  //       new UpdateUserUrlStatusDto(event.status),
  //       readManager,
  //     );
  //   });

  //   try {
  //     this.eventStore.saveEvent(event, this.manager);

  //     await this.urlReadRepository.updateStatus(
  //       event.urlId,
  //       new UpdateUserUrlStatusDto(event.status),
  //       this.readManager,
  //     );
  //   } catch (error) {
  //     //saveEvent delete, updateStatus 원복하는 이벤트버스
  //   }
  // }

  private async handleNextStepEvent(event: NextStepEvent) {
    this.eventStore.saveEvent(event, this.manager);
  }

  // private async handleCreateUserEvent(event: CreateUserEvent) {
  //   await this.readManager.transaction(async (readManager) => {
  //     await this.manager.transaction(async (manager) => {
  //       this.eventStore.saveEvent(event, manager);
  //     });

  //     this.userReadRepository.create(
  //       new CreateUserReadDto(
  //         event.userId,
  //         event.imgId,
  //         event.nickname,
  //         event.urlId,
  //         event.createdAt,
  //         event.updatedAt,
  //         event.deletedAt,
  //       ),
  //       readManager,
  //     );

  //     this.urlReadRepository.updateUserList(
  //       event.urlId,
  //       event.userId,
  //       readManager,
  //     );
  //   });
  // }
}
