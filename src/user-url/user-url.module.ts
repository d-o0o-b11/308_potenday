import { Module } from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import { UserUrlController } from './user-url.controller';
import { EntitiesModule } from 'src/entity.module';

@Module({
  imports: [EntitiesModule],
  controllers: [UserUrlController],
  providers: [UserUrlService],
  exports: [UserUrlService],
})
export class UserUrlModule {}
