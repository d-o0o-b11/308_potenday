import { Module } from '@nestjs/common';
import { GameKindService } from './game-kind.service';
import { GameKindController } from './game-kind.controller';
import { EntitiesModule } from 'src/entity.module';
import { UserUrlModule } from 'src/user-url/user-url.module';

@Module({
  imports: [EntitiesModule, UserUrlModule],
  controllers: [GameKindController],
  providers: [GameKindService],
})
export class GameKindModule {}
