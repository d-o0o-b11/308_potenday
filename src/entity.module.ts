import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUrlEntity } from './user-url/entities/user-url.entity';
import { UserInfoEntity } from './user-url/entities/user-info.entity';
import { AdjectiveExpressionEntity } from './game-kind/entities/adjective-expression.entity';
import { UserAdjectiveExpressionEntity } from './game-kind/entities/user-adjective-expression.entity';
import { BalanceGameEntity } from './game-kind/entities/balance-game-list.entity';
import { CommonQuestionEntity } from './game-kind/entities/common-question.entity';
import { UserBalanceGameEntity } from './game-kind/entities/user-balance-game.entity';
import { MbtiChooseEntity } from './game-kind/entities/mbti-choose.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserUrlEntity,
      UserInfoEntity,
      AdjectiveExpressionEntity,
      UserAdjectiveExpressionEntity,
      BalanceGameEntity,
      CommonQuestionEntity,
      UserBalanceGameEntity,
      MbtiChooseEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
