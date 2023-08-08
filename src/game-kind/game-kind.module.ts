import { Module } from '@nestjs/common';
import { AdjectiveExpressionService } from './service/adjective-expression.service';
import { AdjectiveExpressionController } from './controller/adjective-expression.controller';
import { EntitiesModule } from 'src/entity.module';
import { UserUrlModule } from 'src/user-url/user-url.module';
import { BalanceGameService } from './service/balance-game.service';
import { BalanceGameController } from './controller/ balance-game.controller';

@Module({
  imports: [EntitiesModule, UserUrlModule],
  controllers: [AdjectiveExpressionController, BalanceGameController],
  providers: [AdjectiveExpressionService, BalanceGameService],
})
export class GameKindModule {}
