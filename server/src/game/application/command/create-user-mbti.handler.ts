import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_MBTI_REPOSITORY_TOKEN } from '../../infrastructure';
import { GameNextFactory, IUserMbtiRepository } from '../../domain';
import { CountUsersInRoomQuery } from '@user';
import { CreateUserMbtiCommand } from './create-user-mbti.command';

@CommandHandler(CreateUserMbtiCommand)
export class CreateUserMbtiCommandHandler
  implements ICommandHandler<CreateUserMbtiCommand>
{
  constructor(
    @Inject(USER_MBTI_REPOSITORY_TOKEN)
    private readonly userMbtiRepository: IUserMbtiRepository,
    private queryBus: QueryBus,
    private readonly gameNextFactory: GameNextFactory,
  ) {}

  async execute(command: CreateUserMbtiCommand) {
    //url 제거하기
    const { url, urlId, userId, mbti, toUserId } = command;

    await this.userMbtiRepository.save({ userId, mbti, toUserId });

    const submitCount = (await this.userMbtiRepository.find(toUserId)).length;
    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(url),
    );

    if (submitCount === userCount) {
      this.gameNextFactory.create(urlId);
    }
  }
}
