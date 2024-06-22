import { Injectable } from '@nestjs/common';
import { UserAdjectiveExpression } from '../user-adjective-expression';
import { Adjective } from '../enums';

@Injectable()
export class UserAdjectiveExpressionFactory {
  reconstituteArray(
    userId: number,
    nickName: string,
    imgId: number,
    adjectiveExpression: Adjective,
  ): UserAdjectiveExpression {
    return new UserAdjectiveExpression(
      undefined,
      userId,
      adjectiveExpression,
      nickName,
      imgId,
    );
  }
}
