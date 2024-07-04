import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../user';
import { UserCreateEvent } from '../user-create.event';
import {
  CreateFactoryUserDto,
  ReconstituteArrayUserFactoryDto,
} from '../../interface';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  /**
   * 유저 객체 생성
   * -> UserCreateEvent 발행
   * 이후 생성한 유저 도메인 객체 리턴
   */
  create(dto: CreateFactoryUserDto): User {
    const user = new User(dto.userId, dto.imgId, dto.nickName, dto.urlId);
    this.eventBus.publish(new UserCreateEvent(user.getUrlId()));
    return user;
  }

  reconstituteArray(dto: ReconstituteArrayUserFactoryDto): User {
    return new User(dto.id, dto.imgId, dto.nickName, dto.urlId);
  }
}
