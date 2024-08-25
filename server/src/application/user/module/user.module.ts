import { Module } from '@nestjs/common';
import { UserFactory, UrlFactory } from '@domain';
import { UserController, UserUrlController } from '@interface';
import { CqrsModule } from '@nestjs/cqrs';
import {
  URL_READ_REPOSITORY_TOKEN,
  UrlReadRepository,
  USER_REPOSITORY_TOKEN,
  USER_URL_EVENT_PUBLISHER,
  URL_REPOSITORY_TOKEN,
  USER_URL_SERVICE_TOKEN,
  UserReadRepository,
  UserRepository,
  UserUrlRepository,
  USER_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import {
  EventRollbackHandler,
  UserEventHandler,
  UserUrlEventPublisher,
} from '../event';
import {
  CreateUserHandler,
  CreateUrlReadCommandHandler,
  CreateUrlCommandHandler,
  NextStepHandler,
  UpdateStatusFalseHandler,
  CreateUserReadCommandHandler,
  UpdateUrlReadStatusCommandHandler,
} from '../command';
import {
  CountUsersInRoomQueryHandler,
  GetUrlStatusHandler,
  GetUsersInRoomQueryHandler,
} from '../query';
import { UserUrlService } from '../service';
import { UrlSaga, UserSaga } from '../saga';
import { EventModule } from '../../event';

@Module({
  imports: [CqrsModule, EventModule],
  controllers: [UserController, UserUrlController],
  providers: [
    UserEventHandler,
    CreateUserHandler,
    CreateUrlCommandHandler,
    CountUsersInRoomQueryHandler,
    UpdateStatusFalseHandler,
    GetUrlStatusHandler,
    GetUsersInRoomQueryHandler,
    NextStepHandler,
    UrlSaga,
    UserSaga,
    EventRollbackHandler,
    CreateUserReadCommandHandler,
    UpdateUrlReadStatusCommandHandler,
    CreateUrlReadCommandHandler,
    UserFactory,
    UrlFactory,
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
    { provide: URL_REPOSITORY_TOKEN, useClass: UserUrlRepository },
    { provide: USER_URL_SERVICE_TOKEN, useClass: UserUrlService },
    { provide: USER_URL_EVENT_PUBLISHER, useClass: UserUrlEventPublisher },
    {
      provide: URL_READ_REPOSITORY_TOKEN,
      useClass: UrlReadRepository,
    },
    {
      provide: USER_READ_REPOSITORY_TOKEN,
      useClass: UserReadRepository,
    },
  ],
})
export class UserModule {}
