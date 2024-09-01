import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
  AdjectiveExpressionRepository,
  BalanceRepository,
  MbtiRepository,
  MBTI_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
  BALANCE_SERVICE_TOKEN,
  MBTI_SERVICE_TOKEN,
  AdjectiveExpressionReadRepository,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  BALANCE_READ_REPOSITORY_TOKEN,
  MbtiReadRepository,
  MBTI_REPOSITORY_READ_TOKEN,
  BalanceReadRepository,
} from '@infrastructure';
import {
  AdjectiveExpressionFactory,
  BalanceListFactory,
  BalanceFactory,
  UserMbtiFactory,
} from '@domain';
import {
  AdjectiveExpressionController,
  BalanceController,
  CommonQuestionController,
  MbtiController,
} from '@interface';
import { CqrsModule } from '@nestjs/cqrs';
import { AdjectiveExpressionEntity } from '@infrastructure/game/database/entity/cud/adjective-expression.entity';
import { BalanceListEntity } from '@infrastructure/game/database/entity/cud/balance-list.entity';
import { UserMbtiEntity } from '@infrastructure/game/database/entity/cud/user-mbti.entity';
import { UserAdjectiveExpressionEntity } from '@infrastructure/game/database/entity/cud/user-adjective-expression.entity';
import { UserBalanceEntity } from '@infrastructure/game/database/entity/cud/user-balance.entity';
import { EventGameRollbackHandler, GameEventHandler } from '../event';
import {
  GetAdjectiveExpressionQueryHandler,
  GetBalanceListQueryHandler,
  GetBalanceResultQueryHandler,
  GetUserMbtiQueryHandler,
  GetUsersAdjectiveExpressionQueryHandler,
  GetUsersMbtiInUrlQueryHandler,
} from '../query';
import {
  CreateUserAdjectiveExpressionHandler,
  CreateUserBalanceCommandHandler,
  CreateUserBalanceReadCommandHandler,
  CreateUserExpressionReadCommandHandler,
  CreateUserMbtiCommandHandler,
  CreateUserMbtiReadCommandHandler,
  NextCommonQuestionCommandHandler,
} from '../command';
import {
  AdjectiveExpressionService,
  BalanceService,
  MbtiService,
} from '../service';
import { EventModule } from '../../event';
import { GameSaga } from '../saga';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdjectiveExpressionEntity,
      BalanceListEntity,
      UserMbtiEntity,
      UserAdjectiveExpressionEntity,
      UserBalanceEntity,
    ]),
    CqrsModule,
    EventModule,
  ],
  controllers: [
    AdjectiveExpressionController,
    CommonQuestionController,
    BalanceController,
    MbtiController,
  ],
  providers: [
    GameEventHandler,
    GetAdjectiveExpressionQueryHandler,
    CreateUserAdjectiveExpressionHandler,
    NextCommonQuestionCommandHandler,
    GetUsersAdjectiveExpressionQueryHandler,
    GetBalanceListQueryHandler,
    CreateUserBalanceCommandHandler,
    GetBalanceResultQueryHandler,
    CreateUserMbtiCommandHandler,
    GetUserMbtiQueryHandler,
    GetUsersMbtiInUrlQueryHandler,
    AdjectiveExpressionFactory,
    BalanceListFactory,
    BalanceFactory,
    UserMbtiFactory,
    GameSaga,
    EventGameRollbackHandler,
    CreateUserExpressionReadCommandHandler,
    CreateUserBalanceReadCommandHandler,
    CreateUserMbtiReadCommandHandler,
    {
      provide: ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
      useClass: AdjectiveExpressionRepository,
    },
    {
      provide: BALANCE_REPOSITORY_TOKEN,
      useClass: BalanceRepository,
    },
    {
      provide: MBTI_REPOSITORY_TOKEN,
      useClass: MbtiRepository,
    },
    {
      provide: ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
      useClass: AdjectiveExpressionService,
    },
    {
      provide: BALANCE_SERVICE_TOKEN,
      useClass: BalanceService,
    },
    {
      provide: MBTI_SERVICE_TOKEN,
      useClass: MbtiService,
    },
    {
      provide: ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
      useClass: AdjectiveExpressionReadRepository,
    },
    {
      provide: BALANCE_READ_REPOSITORY_TOKEN,
      useClass: BalanceReadRepository,
    },
    {
      provide: MBTI_REPOSITORY_READ_TOKEN,
      useClass: MbtiReadRepository,
    },
  ],
  exports: [],
})
export class GameModule {}
