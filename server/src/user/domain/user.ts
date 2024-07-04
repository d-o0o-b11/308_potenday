/**
 * 도메인 모델을 표현
 * 클린 아키텍처에서 도메인 모델은 비즈니스 로지고가 규칙을 포함하며,
 * 애플리케이션의 핵심을 구성합니다.
 * 이를 통해 데이터와 로직을 명확히 분리하고, 유지보수성과 테스트 용이성을 높일 수 있다.
 */

import { UserAdjectiveExpression } from '@game';

export class User {
  constructor(
    private readonly id: number,
    private readonly imgId: number,
    private readonly nickName: string,
    private readonly urlId: number,
    private readonly adjectiveExpressions?: UserAdjectiveExpression[],
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }

  getNickName(): Readonly<string> {
    return this.nickName;
  }

  getUrlId(): Readonly<number> {
    return this.urlId;
  }

  getAdjectiveExpressions(): Readonly<UserAdjectiveExpression[] | undefined> {
    return this.adjectiveExpressions;
  }
}
