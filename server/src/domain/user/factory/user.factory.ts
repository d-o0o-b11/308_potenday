import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../user';
import { CreateUserInfoEvent } from '../user-create.event';
import { UserRead } from '../user-read';
import { CreateFactoryUserDto, CreateUserReadDto } from '@application';

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
      dto.name,
      dto.urlId,
      dto.createdAt,
      dto.updatedAt,
      dto.deletedAt,
    );
    this.eventBus.publish(new CreateUserInfoEvent(user.getUrlId()));
    return user;
  }

  reconstituteRead(dto: CreateUserReadDto): UserRead {
    return new UserRead(
      dto.userId,
      dto.imgId,
      dto.name,
      dto.urlId,
      dto.createdAt,
      dto.updatedAt,
      dto.deletedAt,
      dto.balance,
      dto.mbti,
      dto.adjectiveExpression,
    );
  }
}
