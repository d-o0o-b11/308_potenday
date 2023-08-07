import { Module } from '@nestjs/common';
import { GameKindService } from './game-kind.service';
import { GameKindController } from './game-kind.controller';

@Module({
  controllers: [GameKindController],
  providers: [GameKindService],
})
export class GameKindModule {}
