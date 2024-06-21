import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { USER_BALANCE_REPOSITORY_TOKEN } from '../../infrastructure';
import { GameNextFactory, IUserBalanceRepository } from '../../domain';
import { CreateUserBalanceCommand } from './create-user-balance.command';
import { CountUsersInRoomQuery } from '@user';

@CommandHandler(CreateUserBalanceCommand)
export class CreateUserBalanceCommandHandler
  implements ICommandHandler<CreateUserBalanceCommand>
{
  constructor(
    @Inject(USER_BALANCE_REPOSITORY_TOKEN)
    private readonly userBalanceRepository: IUserBalanceRepository,
    private queryBus: QueryBus,
    private readonly gameNextFactory: GameNextFactory,
  ) {}

  async execute(command: CreateUserBalanceCommand): Promise<void> {
    //url 제거하기
    const { url, urlId, userId, balanceId, balanceType } = command;

    await this.userBalanceRepository.save(userId, balanceId, balanceType);

    const submitCount = (await this.userBalanceRepository.find(urlId)).length;
    const { userCount } = await this.queryBus.execute(
      new CountUsersInRoomQuery(url),
    );

    if (submitCount === userCount) {
      this.gameNextFactory.create(urlId);
    }
  }
}
