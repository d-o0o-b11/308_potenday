/**
 * 도메인 모델을 표현
 * 클린 아키텍처에서 도메인 모델은 비즈니스 로지고가 규칙을 포함하며,
 * 애플리케이션의 핵심을 구성합니다.
 * 이를 통해 데이터와 로직을 명확히 분리하고, 유지보수성과 테스트 용이성을 높일 수 있다.
 */

import { UserAdjectiveExpression } from '@domain';

export class User {
  constructor(
    private readonly id: number,
    private readonly imgId: number,
    private readonly name: string,
    private readonly urlId: number,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
    private readonly deletedAt?: Date,
    private readonly adjectiveExpressions?: UserAdjectiveExpression[], //이게 여기있는 이유는..? @memo
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getImgId(): Readonly<number> {
    return this.imgId;
  }

  getName(): Readonly<string> {
    return this.name;
  }

  getUrlId(): Readonly<number> {
    return this.urlId;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<Date> {
    return this.updatedAt;
  }

  getDeletedAt(): Readonly<Date> {
    return this.deletedAt;
  }

  getAdjectiveExpressions(): Readonly<UserAdjectiveExpression[] | undefined> {
    return this.adjectiveExpressions;
  }
}
