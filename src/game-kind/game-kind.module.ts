import { Module } from '@nestjs/common';
import { GameKindService } from './game-kind.service';
import { GameKindController } from './game-kind.controller';
import { EntitiesModule } from 'src/entity.module';

@Module({
  imports: [EntitiesModule],
  controllers: [GameKindController],
  providers: [GameKindService],
})
export class GameKindModule {}
