import { Module } from '@nestjs/common';
import { UserFactory, UserUrlFactory } from '@domain';
import { UserController, UserUrlController } from '@interface';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UrlReadRepository,
  USER_REPOSITORY_TOKEN,
  USER_URL_EVENT_PUBLISHER,
  USER_URL_REPOSITORY_TOKEN,
  USER_URL_SERVICE_TOKEN,
  UserReadRepository,
  UserRepository,
  UserUrlRepository,
} from '@infrastructure';
import {
  EventRollbackHandler,
  EventSourcingHandler,
  UserEventHandler,
  UserUrlEventPublisher,
} from '../event';
import {
  CreateUserHandler,
  CreateUrlReadCommandHandler,
  CreateUrlCommandHandler,
  NextStepHandler,
  UpdateStatusFalseHandler,
} from '../command';
import {
  CountUsersInRoomQueryHandler,
  GetUrlStatusHandler,
  GetUsersInRoomQueryHandler,
} from '../query';
import { UserUrlService } from '../service';
import { UserEntity } from '@infrastructure/user/database/entity/cud/user.entity';
import { UserUrlEntity } from '@infrastructure/user/database/entity/cud/user-url.entity';
import { UrlReadEntity } from '@infrastructure/user/database/entity/read/url-read.entity';
import { UserReadEntity } from '@infrastructure/user/database/entity/read/user-read.entity';
import { EventStore } from '../event/event.store';
import { UrlSaga } from '../saga';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserUrlEntity]),
    TypeOrmModule.forFeature([UrlReadEntity, UserReadEntity], 'read'),
    CqrsModule,
  ],
  controllers: [UserController, UserUrlController],
  providers: [
    UserEventHandler,
    CreateUserHandler,
    CreateUrlCommandHandler,
    CountUsersInRoomQueryHandler,
    UpdateStatusFalseHandler,
    GetUrlStatusHandler,
    GetUsersInRoomQueryHandler,
    EventSourcingHandler,
    NextStepHandler,
    UrlSaga,
    EventRollbackHandler,
    UserFactory,
    UserUrlFactory,
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
    { provide: USER_URL_REPOSITORY_TOKEN, useClass: UserUrlRepository },
    { provide: USER_URL_SERVICE_TOKEN, useClass: UserUrlService },
    { provide: USER_URL_EVENT_PUBLISHER, useClass: UserUrlEventPublisher },
    UrlReadRepository,
    UserReadRepository,
    //수정 필요
    EventStore,
    CreateUrlReadCommandHandler,
  ],
})
export class UserModule {}
