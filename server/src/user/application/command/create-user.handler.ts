import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../domain';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { IUserUrlService, UserResponseDto } from '../../interface';
import {
  USER_REPOSITORY_TOKEN,
  USER_URL_SERVICE_TOKEN,
} from '../../infrastructure';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    // IUserRepository 는 클래스가 아니므로 의존선 클래스로 주입받을 수 없음
    // 따라서 @Inject 데커레이터와 UserRepository 토큰을 이용하여 주입받음
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository,
    @Inject(USER_URL_SERVICE_TOKEN) private urlService: IUserUrlService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { urlId, imgId, nickName } = command;

    await this.urlService.checkUserLimitForUrl({ urlId });
    //4명 미만일 시 유저 추가
    const result = await this.userRepository.save({ urlId, imgId, nickName });

    return result;
  }
}
