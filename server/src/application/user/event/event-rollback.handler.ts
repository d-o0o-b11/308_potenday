import {
  UrlReadRepository,
  USER_REPOSITORY_TOKEN,
  USER_URL_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@infrastructure';
import {
  DeleteUpdateUrlStatusEvent,
  DeleteUrlEvent,
  DeleteUserEvent,
} from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from './event.store';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import { IUserRepository, IUserUrlRepository } from '@domain';
import { UpdateUserUrlDto, UpdateUserUrlStatusDto } from '@interface';

@EventsHandler(DeleteUrlEvent, DeleteUpdateUrlStatusEvent, DeleteUserEvent)
export class EventRollbackHandler
  implements
    IEventHandler<
      DeleteUrlEvent | DeleteUpdateUrlStatusEvent | DeleteUserEvent
    >
{
  constructor(
    private readonly eventStore: EventStore,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private urlRepository: IUserUrlRepository,
    private readonly urlReadRepository: UrlReadRepository,
    private readonly userReadRepository: UserReadRepository,
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository,
  ) {}

  async handle(
    event: DeleteUrlEvent | DeleteUpdateUrlStatusEvent | DeleteUserEvent,
  ) {
    switch (event.constructor) {
      case DeleteUrlEvent:
        await this.handleDeleteUrlEvent(event as DeleteUrlEvent);
        break;
      case DeleteUpdateUrlStatusEvent:
        await this.handleDeleteUpdateUrlStatusEvent(
          event as DeleteUpdateUrlStatusEvent,
        );
        break;
      case DeleteUserEvent:
        await this.handleDeleteUserEvent(event as DeleteUserEvent);
        break;
      default:
        break;
    }
  }

  private async handleDeleteUrlEvent(event: DeleteUrlEvent) {
    try {
      await this.eventStore.saveEvent(event, this.manager);
      await this.urlRepository.delete(event.urlId, this.manager);
      await this.urlReadRepository.delete(event.urlId, this.readManager);
    } catch (error) {
      console.error('Error processing DeleteUrlEvent:', error);
      //슬랙
    }
  }

  private async handleDeleteUpdateUrlStatusEvent(
    event: DeleteUpdateUrlStatusEvent,
  ) {
    try {
      await this.eventStore.saveEvent(event, this.manager);
      await this.urlRepository.update(
        new UpdateUserUrlDto(event.urlId, true),
        this.manager,
      );
      await this.urlReadRepository.updateStatus(
        event.urlId,
        new UpdateUserUrlStatusDto(true),
        this.readManager,
      );
    } catch (error) {
      console.error('Error processing DeleteUpdateUrlStatusEvent:', error);
      //슬랙
    }
  }

  private async handleDeleteUserEvent(event: DeleteUserEvent) {
    try {
      await this.eventStore.saveEvent(event, this.manager);
      await this.userRepository.delete(event.userId, this.manager);
      await this.userReadRepository.delete(event.userId, this.readManager);
      await this.urlReadRepository.deleteUserId(
        event.urlId,
        event.userId,
        this.readManager,
      );
    } catch (error) {
      console.error('Error processing DeleteUserEvent:', error);
      //슬랙
    }
  }
}
