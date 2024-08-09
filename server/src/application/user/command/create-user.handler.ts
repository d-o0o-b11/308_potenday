import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY_TOKEN, USER_URL_SERVICE_TOKEN } from '@infrastructure';
import { IUserRepository } from '@domain';
import {
  CreateUserDto,
  FindOneUserUrlDto,
  IUserUrlService,
  UserResponseDto,
} from '@interface';
import { CreateUserEvent } from '../event';
import { UrlMaximumUserAlreadyClickButtonException } from '@common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    // IUserRepository 는 클래스가 아니므로 의존선 클래스로 주입받을 수 없음
    // 따라서 @Inject 데커레이터와 UserRepository 토큰을 이용하여 주입받음
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: IUserRepository,
    @Inject(USER_URL_SERVICE_TOKEN) private urlService: IUserUrlService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { urlId, imgId, nickName } = command;

    const { userCount } = await this.urlService.checkUserLimitForUrl(
      new FindOneUserUrlDto(urlId),
    );
    //4명 미만일 시 유저 추가
    if (userCount >= 4) {
      throw new UrlMaximumUserAlreadyClickButtonException();
    }
    const result = await this.userRepository.create(
      new CreateUserDto(urlId, imgId, nickName),
    );

    this.eventBus.publish(
      new CreateUserEvent(
        'CreateUserCommand',
        'save',
        result.getId(),
        result.getImgId(),
        result.getNickName(),
        result.getUrlId(),
        result.getCreatedAt(),
        result.getUpdatedAt(),
        result.getDeletedAt(),
      ),
    );

    return {
      id: result.getId(),
      imgId: result.getImgId(),
      nickName: result.getNickName(),
      urlId: result.getUrlId(),
    };
  }
}
