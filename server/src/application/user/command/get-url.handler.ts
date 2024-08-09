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

    this.eventBus.publish(
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

    return {
      id: result.getId(),
      url: result.getUrl(),
    };
  }
}
