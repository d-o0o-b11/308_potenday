import { Module } from '@nestjs/common';
import { AdjectiveExpressionService } from './adjective-expression.service';
import { AdjectiveExpressionController } from './adjective-expression.controller';
import { EntitiesModule } from 'src/entity.module';
import { UserUrlModule } from 'src/user-url/user-url.module';

@Module({
  imports: [EntitiesModule, UserUrlModule],
  controllers: [AdjectiveExpressionController],
  providers: [AdjectiveExpressionService],
})
export class GameKindModule {}
