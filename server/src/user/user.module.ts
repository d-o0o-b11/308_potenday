import { Module } from '@nestjs/common';
import { UserFactory, UserUrlFactory } from './domain';
import { UserController, UserUrlController } from './interface';
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
} from './application';
import {
  USER_REPOSITORY_TOKEN,
  USER_URL_REPOSITORY_TOKEN,
  USER_URL_SERVICE_TOKEN,
  UserEntity,
  UserRepository,
  UserUrlEntity,
  UserUrlRepository,
} from './infrastructure';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserUrlEntity]), CqrsModule],
  controllers: [UserController, UserUrlController],
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
  ],
})
export class UserModule {}
