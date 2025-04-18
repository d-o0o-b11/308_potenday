import {
  URL_READ_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
  URL_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
  EVENT_REPOSITORY_TOKEN,
} from '@infrastructure';
import {
  DeleteUpdateUrlStatusEvent,
  DeleteUrlEvent,
  DeleteUserEvent,
} from './event-sourcing.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Inject } from '@nestjs/common';
import {
  IUrlReadRepository,
  IUserRepository,
  IUrlRepository,
  IUserReadRepository,
  IEventRepository,
} from '@domain';
import {
  DeleteUserIdDto,
  UpdateUserUrlDto,
  UpdateUserUrlStatusDto,
} from '../dto';
import { SlackService } from '@common';

@EventsHandler(DeleteUrlEvent, DeleteUpdateUrlStatusEvent, DeleteUserEvent)
export class EventRollbackHandler
  implements
    IEventHandler<
      DeleteUrlEvent | DeleteUpdateUrlStatusEvent | DeleteUserEvent
    >
{
  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private urlRepository: IUrlRepository,
    @Inject(URL_READ_REPOSITORY_TOKEN)
    private readonly urlReadRepository: IUrlReadRepository,
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: IUserReadRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
    private readonly slackService: SlackService,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
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
      await this.eventRepository.create(event, this.manager);
      await this.urlRepository.delete(event.urlId, this.manager);
      await this.urlReadRepository.delete(event.urlId, this.readManager);
    } catch (error) {
      this.errorSendSlack(event, error);
    }
  }

  private async handleDeleteUpdateUrlStatusEvent(
    event: DeleteUpdateUrlStatusEvent,
  ) {
    try {
      await this.eventRepository.create(event, this.manager);
      await this.urlRepository.update(
        event.urlId,
        new UpdateUserUrlDto(true),
        this.manager,
      );
      await this.urlReadRepository.updateStatus(
        new UpdateUserUrlStatusDto(event.urlId, true),
        this.readManager,
      );
    } catch (error) {
      this.errorSendSlack(event, error);
    }
  }

  private async handleDeleteUserEvent(event: DeleteUserEvent) {
    try {
      await this.eventRepository.create(event, this.manager);
      await this.userRepository.delete(event.userId, this.manager);
      await this.userReadRepository.delete(event.userId, this.readManager);
      await this.urlReadRepository.deleteUserId(
        event.urlId,
        new DeleteUserIdDto(event.userId),
        this.readManager,
      );
    } catch (error) {
      this.errorSendSlack(event, error);
    }
  }

  private errorSendSlack(
    event: DeleteUrlEvent | DeleteUpdateUrlStatusEvent | DeleteUserEvent,
    error: any,
  ) {
    const { eventMethod, eventType, ...data } = event;
    const message = `
      - Code: ${eventType}
      - eventMethod: ${eventMethod} 
      - data: ${JSON.stringify(data)}
      - Timestamp: ${new Date().toISOString()}
      - Details: ${error || 'No details available'}
      `;

    // 슬랙에 예외 메시지 전송
    this.slackService.sendErrorMessage(message);
  }
}
