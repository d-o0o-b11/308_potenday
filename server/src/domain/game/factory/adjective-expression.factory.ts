import { Injectable } from '@nestjs/common';
import { AdjectiveExpression } from '../adjective-expression';
import { Adjective } from '../enums';
import { UserAdjectiveExpression } from '../user-adjective-expression';
import { FindUserAdjectiveExpressionReadDto } from '@interface';
import { UserRead } from '../../user';

@Injectable()
export class AdjectiveExpressionFactory {
  reconstituteArray(id: number, adjective: Adjective): AdjectiveExpression {
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

  reconstituteAdjectiveExpressionRead(dto: FindUserAdjectiveExpressionReadDto) {
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
