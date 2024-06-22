import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../user';
import { UserCreateEvent } from '../user-create.event';
import {
  CreateUserDto,
  ReconstituteArrayUserFactoryDto,
  ReconstituteUserFactoryDto,
} from '../../interface';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  /**
   * 유저 객체 생성
   * -> UserCreateEvent 발행
   * 이후 생성한 유저 도메인 객체 리턴
   */
  create(dto: CreateUserDto): User {
    const user = new User(undefined, dto.imgId, dto.nickName, dto.urlId);
    this.eventBus.publish(new UserCreateEvent(user.getUrlId()));
    return user;
  }

  // 이벤트 발행없이 유저 객체만 생성
  // entity 반환 x -> User 도메인 객체로 리턴
  reconstitute(dto: ReconstituteUserFactoryDto): User {
    return new User(dto.id, dto.imgId, dto.nickName, dto.urlId, dto.onboarding);
  }

  reconstituteArray(dto: ReconstituteArrayUserFactoryDto): User {
    return new User(dto.id, dto.imgId, dto.nickName, dto.urlId);
  }
}
