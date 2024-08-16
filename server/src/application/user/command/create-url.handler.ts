import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUrlCommand } from './create-url.command';
import { Inject } from '@nestjs/common';
import { USER_URL_SERVICE_TOKEN } from '@infrastructure';
import { IUserUrlService, SetUrlResponseDto } from '@interface';
import { CreateUrlEvent } from '../event/event-sourcing.event';

/**
 * 이벤트는 비동기적이다.
 * 그래서 이벤트에서 에러가 발생해도 해당 api에 영향을 주지 못한다..
 * 현재 로직은 이벤트가 실패해서 롤백을 해도 성공된 데이터를 반환한다.
 */
@CommandHandler(CreateUrlCommand)
export class CreateUrlCommandHandler
  implements ICommandHandler<CreateUrlCommand>
{
  constructor(
    @Inject(USER_URL_SERVICE_TOKEN)
    private urlService: IUserUrlService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<SetUrlResponseDto> {
    const result = await this.urlService.setUrl();

    this.eventBus.publish(
      new CreateUrlEvent(
        // 'CreateUrlCommand',
        // 'save',
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
