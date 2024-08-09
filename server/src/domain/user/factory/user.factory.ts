import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../user';
import { CreateUserEvent } from '../user-create.event';
import {
  CreateFactoryUserDto,
  CreateUserReadDto,
  ReconstituteArrayUserFactoryDto,
} from '@interface';
import { UserRead } from '../user-read';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  /**
   * 유저 객체 생성
   * -> CreateUserEvent 발행
   * 이후 생성한 유저 도메인 객체 리턴
   * 유저 객체 생성 시 항상 이벤트를 발행해야 한다
   */
  create(dto: CreateFactoryUserDto): User {
    const user = new User(
      dto.userId,
      dto.imgId,
      dto.nickName,
      dto.urlId,
      dto.createdAt,
      dto.updatedAt,
      dto.deletedAt,
    );
    this.eventBus.publish(new CreateUserEvent(user.getUrlId()));
    return user;
  }

  reconstituteArray(dto: ReconstituteArrayUserFactoryDto): User {
    return new User(dto.id, dto.imgId, dto.nickName, dto.urlId);
  }

  reconstituteRead(dto: CreateUserReadDto): UserRead {
    return new UserRead(
      dto.userId,
      dto.imgId,
      dto.nickname,
      dto.urlId,
      dto.createdAt,
      dto.updatedAt,
      dto.deletedAt,
      dto.balance,
      dto.mbti,
      dto.adjectiveExpressionList,
    );
  }
}
