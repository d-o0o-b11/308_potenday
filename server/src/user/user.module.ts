import { Module } from '@nestjs/common';
import { UserFactory, UserUrlFactory } from './domain';
import {
  UserRepository,
  UserUrlRepository,
} from './infrastructure/database/repository';
import { UserController, UserUrlController } from './interface';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserUrlEntity } from './infrastructure/database/entity';
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
