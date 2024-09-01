import { Injectable } from '@nestjs/common';
import { AdjectiveExpression } from '../adjective-expression';
import { Adjective } from '../enums';
import { UserAdjectiveExpression } from '../user-adjective-expression';
import { UserRead } from '../../user';
import { FindUserAdjectiveExpressionReadDto } from '@application';

@Injectable()
export class AdjectiveExpressionFactory {
  reconstitute(id: number, adjective: Adjective): AdjectiveExpression {
    return new AdjectiveExpression(id, adjective);
  }

  reconstituteUserArray(
    id: number,
    userId: number,
    adjectiveExpressionId: number,
    createdAt: Date,
  ): UserAdjectiveExpression {
    return new UserAdjectiveExpression(
      id,
      userId,
      adjectiveExpressionId,
      createdAt,
    );
  }

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
