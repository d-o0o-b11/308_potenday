import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserMbtiCommand } from './create-user-mbti.command';
import { MBTI_SERVICE_TOKEN } from '@infrastructure';
import { IMbtiService } from '@interface';
import {
  CountUsersInRoomQuery,
  CreateUserMbtiEvent,
  GameNextEvent,
  SaveUserMbtiDto,
} from '@application';

@CommandHandler(CreateUserMbtiCommand)
export class CreateUserMbtiCommandHandler
  implements ICommandHandler<CreateUserMbtiCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    @Inject(MBTI_SERVICE_TOKEN)
    private readonly mbtiService: IMbtiService,
  ) {}

  async execute(command: CreateUserMbtiCommand): Promise<void> {
    const { urlId, userId, mbti, toUserId } = command;

    const { submitCount, saveResult } =
      await this.mbtiService.saveUserMbtiAndGetSubmitCount(
        new SaveUserMbtiDto(urlId, userId, mbti, toUserId),
      );

    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(urlId),
    );

    this.eventBus.publish(
      new CreateUserMbtiEvent(
        saveResult.getUserId(),
        saveResult.getMbti(),
        saveResult.getToUserId(),
        saveResult.getId(),
        saveResult.getCreatedAt(),
      ),
    );

    if (submitCount + 1 === userCount) {
      this.eventBus.publish(
        new GameNextEvent('MbtiGameNextEvent', 'event', urlId),
      );
    }
  }
}
