import { Module } from '@nestjs/common';
import { UserFactory, UserUrlFactory } from './domain';
// import { UserController, UserUrlController } from './interface';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CountUsersInRoomQueryHandler,
  CreateUserHandler,
  GetUrlQueryHandler,
  GetUrlStatusHandler,
  NextStepHandler,
  UpdateStatusFalseHandler,
  UserEventHandler,
  GetUsersInRoomQueryHandler,
  UserUrlService,
  UserUrlEventPublisher,
} from './application';
import {
  USER_REPOSITORY_TOKEN,
  USER_URL_EVENT_PUBLISHER,
  USER_URL_REPOSITORY_TOKEN,
  USER_URL_SERVICE_TOKEN,
  UserRepository,
  UserUrlRepository,
} from './infrastructure';
import { UserUrlEntity } from './infrastructure/database/entity/user-url.entity';
import { UserEntity } from './infrastructure/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserUrlEntity]), CqrsModule],
  // controllers: [UserController, UserUrlController],
  providers: [
    UserEventHandler,
    CreateUserHandler,
    GetUrlQueryHandler,
    CountUsersInRoomQueryHandler,
    UpdateStatusFalseHandler,
    GetUrlStatusHandler,
    GetUsersInRoomQueryHandler,
    NextStepHandler,
    UserFactory,
    UserUrlFactory,
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepository },
    { provide: USER_URL_REPOSITORY_TOKEN, useClass: UserUrlRepository },
    { provide: USER_URL_SERVICE_TOKEN, useClass: UserUrlService },
    { provide: USER_URL_EVENT_PUBLISHER, useClass: UserUrlEventPublisher },
  ],
})
export class UserModule {}
