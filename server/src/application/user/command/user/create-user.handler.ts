import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY_TOKEN, URL_SERVICE_TOKEN } from '@infrastructure';
import { IUserRepository } from '@domain';
import { IUrlService, UserResponseDto } from '@interface';
import { CreateUserEvent } from '../../event';
import { MaximumUrlException, StatusFalseUrlException } from '@common';
import { CreateUserDto, FindOneUserUrlDto } from '@application';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    // IUserRepository 는 클래스가 아니므로 의존선 클래스로 주입받을 수 없음
    // 따라서 @Inject 데커레이터와 UserRepository 토큰을 이용하여 주입받음
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(URL_SERVICE_TOKEN) private readonly urlService: IUrlService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { urlId, imgId, nickName } = command;

    const { userCount, status } = await this.urlService.checkUserLimitForUrl(
      new FindOneUserUrlDto(urlId),
    );

    //게임 진행 중일 경우
    if (!status) {
      throw new StatusFalseUrlException();
    }
    //4명 미만일 시 유저 추가
    if (userCount >= 4) {
      throw new MaximumUrlException();
    }
    const result = await this.userRepository.create(
      new CreateUserDto(urlId, imgId, nickName),
    );

    //saga 만들기
    this.eventBus.publish(
      new CreateUserEvent(
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
