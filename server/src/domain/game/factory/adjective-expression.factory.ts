import { Injectable } from '@nestjs/common';
import { AdjectiveExpression } from '../adjective-expression';
import { UserAdjectiveExpression } from '../user-adjective-expression';
import { UserRead } from '../../user';
import {
  FindUserAdjectiveExpressionReadDto,
  ReconstituteAdjectiveExpressionArrayDto,
  ReconstituteAdjectiveExpressionDto,
} from '@application';

@Injectable()
export class AdjectiveExpressionFactory {
  reconstitute(dto: ReconstituteAdjectiveExpressionDto): AdjectiveExpression {
    return new AdjectiveExpression(dto.id, dto.adjective);
  }

  reconstituteUserArray(
    dto: ReconstituteAdjectiveExpressionArrayDto,
  ): UserAdjectiveExpression {
    return new UserAdjectiveExpression(
      dto.id,
      dto.userId,
      dto.adjectiveExpressionId,
      dto.createdAt,
    );
  }

  /**
   * @NOTE
   * UserRead 객체를 반환하는 로직이 AdjectiveExpressionFactory에 있는게 맞을까?
   * UserFactory 위치가 더 잘어울린다...
   * 옮기면 순환참조 오류가 뜰것같고,,static으로 수정하면 될 것 같은데 UserFactory에서 eventBus를 주입받아
   * 쓰고 있기 때문에 일단은 보류해두었다.
   *
   * 결론: UserFactory로 위치가 이동돼야한다.
   */
  reconstituteAdjectiveExpressionRead(
    dto: FindUserAdjectiveExpressionReadDto,
  ): UserRead {
    return new UserRead(
      dto.userId,
      dto.imgId,
      dto.nickname,
      dto.urlId,
      new Date(Date.now()),
      new Date(Date.now()),
      null,
      undefined,
      undefined,
      dto.adjectiveExpression,
    );
  }
}
