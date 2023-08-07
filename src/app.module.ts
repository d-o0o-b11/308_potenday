import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserUrlModule } from './user-url/user-url.module';
import { SettingModule } from './config/config.module';

@Module({
  imports: [UserUrlModule, SettingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
