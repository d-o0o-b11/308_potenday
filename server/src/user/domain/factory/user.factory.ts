import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { User } from '../user';
import { UserCreateEvent } from '../user-create.event';
import { UserAdjectiveExpression } from '@game';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  /**
   * 유저 객체 생성
   * -> UserCreateEvent 발행
   * 이후 생성한 유저 도메인 객체 리턴
   */
  create(urlId: number, imgId: number, nickName: string): User {
    const user = new User(undefined, imgId, nickName, urlId);
    this.eventBus.publish(new UserCreateEvent(user.getUrlId()));
    return user;
  }

  // 이벤트 발행없이 유저 객체만 생성
  // entity 반환 x -> User 도메인 객체로 리턴
  reconstitute(
    id: number,
    imgId: number,
    nickName: string,
    urlId: number,
    onboarding: boolean,
  ): User {
    return new User(id, imgId, nickName, urlId, onboarding);
  }

  reconstituteArray(
    id: number,
    imgId: number,
    nickName: string,
    urlId: number,
  ): User {
    return new User(id, imgId, nickName, urlId);
  }

  reconstituteAdjectiveExpression(
    id: number,
    imgId: number,
    nickName: string,
    urlId: number,
    onboarding?: boolean,
    adjectiveExpressions?: UserAdjectiveExpression[],
  ): User {
    return new User(
      id,
      imgId,
      nickName,
      urlId,
      onboarding,
      adjectiveExpressions,
    );
  }
}
