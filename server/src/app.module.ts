import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserUrlModule } from './user-url/user-url.module';
import { SettingModule } from './config/config.module';
import { GameKindModule } from './game-kind/game-kind.module';
import { LoggerModule } from './winston/winston.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './sse/sse.module';
import { TransactionModule } from 'nestjs-transaction';

@Module({
  imports: [
    TransactionModule.forRoot(),
    UserUrlModule,
    SettingModule,
    GameKindModule,
    LoggerModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    SseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
