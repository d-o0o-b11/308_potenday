import { Module } from '@nestjs/common';
import { AdjectiveExpressionService } from './adjective-expression.service';
import { AdjectiveExpressionController } from './adjective-expression.controller';
import { EntitiesModule } from 'src/entity.module';
import { UserUrlModule } from 'src/user-url/user-url.module';
import { BalanceGameService } from './balance-game.service';
import { BalanceGameController } from './ balance-game.controller';

@Module({
  imports: [EntitiesModule, UserUrlModule],
  controllers: [AdjectiveExpressionController, BalanceGameController],
  providers: [AdjectiveExpressionService, BalanceGameService],
})
export class GameKindModule {}
