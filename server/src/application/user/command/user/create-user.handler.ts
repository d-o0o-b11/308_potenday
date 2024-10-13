import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY_TOKEN, URL_SERVICE_TOKEN } from '@infrastructure';
import { IUserRepository } from '@domain';
import { IUrlService, UserResponseWithTokenDto } from '@interface';
import { CreateUserEvent } from '../../event';
import { MaximumUrlException, StatusFalseUrlException } from '@common';
import {
  CreateUserDto,
  FindOneUserUrlDto,
  GenerateTokenCommand,
} from '@application';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    // IUserRepository 는 클래스가 아니므로 의존선 클래스로 주입받을 수 없음
    // 따라서 @Inject 데커레이터와 UserRepository 토큰을 이용하여 주입받음
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(URL_SERVICE_TOKEN) private readonly urlService: IUrlService,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseWithTokenDto> {
    const { urlId, imgId, name } = command;

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
      new CreateUserDto(urlId, imgId, name),
    );

    //saga 만들기
    this.eventBus.publish(
      new CreateUserEvent(
        result.getId(),
        result.getImgId(),
        result.getName(),
        result.getUrlId(),
        result.getCreatedAt(),
        result.getUpdatedAt(),
        result.getDeletedAt(),
      ),
    );

    const tokenResult = await this.commandBus.execute(
      new GenerateTokenCommand(result.getUrlId(), result.getId()),
    );

    return {
      id: result.getId(),
      imgId: result.getImgId(),
      name: result.getName(),
      urlId: result.getUrlId(),
      token: tokenResult.token,
    };
  }
}
