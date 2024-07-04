import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_MBTI_SERVICE_TOKEN } from '../../infrastructure';
import { GameNextFactory } from '../../domain';
import { CountUsersInRoomQuery } from '@user';
import { CreateUserMbtiCommand } from './create-user-mbti.command';
import { IUserMbtiService } from '../../interface';

@CommandHandler(CreateUserMbtiCommand)
export class CreateUserMbtiCommandHandler
  implements ICommandHandler<CreateUserMbtiCommand>
{
  constructor(
    private queryBus: QueryBus,
    private readonly gameNextFactory: GameNextFactory,
    @Inject(USER_MBTI_SERVICE_TOKEN)
    private userMbtiService: IUserMbtiService,
  ) {}

  async execute(command: CreateUserMbtiCommand): Promise<void> {
    const { urlId, userId, mbti, toUserId } = command;

    const { submitCount } =
      await this.userMbtiService.saveUserMbtiAndGetSubmitCount({
        userId,
        mbti,
        toUserId,
      });

    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(urlId),
    );

    if (submitCount === userCount) {
      this.gameNextFactory.create(urlId);
    }
  }
}
