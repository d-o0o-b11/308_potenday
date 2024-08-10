import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GetUrlCommand } from './get-url.command';
import { Inject } from '@nestjs/common';
import { USER_URL_SERVICE_TOKEN } from '@infrastructure';
import { IUserUrlService, SetUrlResponseDto } from '@interface';
import { CreateUrlEvent } from '../event/event-sourcing.event';

@CommandHandler(GetUrlCommand)
export class GetUrlCommandHandler implements ICommandHandler<GetUrlCommand> {
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private urlService: IUserUrlService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<SetUrlResponseDto> {
    const result = await this.urlService.setUrl();

    try {
      await this.publishEvent(
        new CreateUrlEvent(
          'GetUrlCommand',
          'save',
          result.getId(),
          result.getUrl(),
          result.getStatus(),
          result.getCreatedAt(),
          result.getUpdatedAt(),
          result.getDeletedAt(),
        ),
      );
    } catch (error) {
      console.error('Error publishing event:', error);
      throw new Error('Event publishing failed');
    }

    return {
      id: result.getId(),
      url: result.getUrl(),
    };
  }

  private async publishEvent(event: CreateUrlEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      this.eventBus.publish(event);
      // 이벤트 버스에 등록된 이벤트 핸들러에서 오류 발생 시 예외 처리
      setTimeout(() => {
        reject(new Error('Event handler failed'));
      }, 0);
    });
  }
}
