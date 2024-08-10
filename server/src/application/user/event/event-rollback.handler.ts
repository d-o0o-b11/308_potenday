import { UrlReadRepository, USER_URL_REPOSITORY_TOKEN } from '@infrastructure';
import { DeleteUrlEvent } from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EventStore } from './event.store';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import { IUserUrlRepository } from '@domain';

@EventsHandler(DeleteUrlEvent)
export class EventRollbackHandler implements IEventHandler<DeleteUrlEvent> {
  constructor(
    private readonly eventStore: EventStore,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private urlRepository: IUserUrlRepository,
    private readonly urlReadRepository: UrlReadRepository,
  ) {}

  async handle(event: DeleteUrlEvent) {
    switch (event.constructor) {
      case DeleteUrlEvent:
        await this.handleCreateUrlEvent(event as DeleteUrlEvent);
        break;
      default:
        break;
    }
  }

  private async handleCreateUrlEvent(event: DeleteUrlEvent) {
    this.eventStore.saveEvent(event, this.manager);
    await this.urlRepository.delete(event.urlId, this.manager);
    await this.urlReadRepository.delete(event.urlId, this.readManager);
  }
}
