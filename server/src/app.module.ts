import { Module } from '@nestjs/common';
import { UserUrlModule } from './user-url/user-url.module';
import { SettingModule } from './config/config.module';
import { GameKindModule } from './game-kind/game-kind.module';
import { LoggerModule } from './winston/winston.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './sse/sse.module';
import { TransactionModule } from 'nestjs-transaction';
import { UserModule } from '@user';
import { APP_FILTER } from '@nestjs/core';
import { BasicExceptionFilter } from '@common';
import { DataBaseModule } from '@database';
import { GameModule } from '@game';

@Module({
  imports: [
    DataBaseModule,
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
    UserModule,
    GameModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BasicExceptionFilter,
    },
  ],
})
export class AppModule {}
