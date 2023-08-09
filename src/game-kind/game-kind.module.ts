import { Module } from '@nestjs/common';
import { AdjectiveExpressionService } from './service/adjective-expression.service';
import { AdjectiveExpressionController } from './controller/adjective-expression.controller';
import { EntitiesModule } from 'src/entity.module';
import { UserUrlModule } from 'src/user-url/user-url.module';
import { BalanceGameService } from './service/balance-game.service';
import { BalanceGameController } from './controller/balance-game.controller';
import { PublicQuestionGameService } from './service/pubilc-question.service';
import { PublicQuestionGameController } from './controller/public-question-game.controller';

@Module({
  imports: [EntitiesModule, UserUrlModule],
  controllers: [
    AdjectiveExpressionController,
    BalanceGameController,
    PublicQuestionGameController,
  ],
  providers: [
    AdjectiveExpressionService,
    BalanceGameService,
    PublicQuestionGameService,
  ],
})
export class GameKindModule {}
