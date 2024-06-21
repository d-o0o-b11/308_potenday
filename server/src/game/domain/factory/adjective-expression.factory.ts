import { Injectable } from '@nestjs/common';
import { AdjectiveExpression } from '../adjective-expression';
import { Adjective } from '../enums';

@Injectable()
export class AdjectiveExpressionFactory {
  reconstituteArray(id: number, adjective: Adjective): AdjectiveExpression {
    return new AdjectiveExpression(id, adjective);
  }
}
