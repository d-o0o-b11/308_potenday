import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  BALANCE_REPOSITORY_TOKEN,
  AdjectiveExpressionRepository,
  BalanceRepository,
  UserMbtiRepository,
  USER_MBTI_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
  USER_BALANCE_SERVICE_TOKEN,
  USER_MBTI_SERVICE_TOKEN,
  AdjectiveExpressionReadRepository,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
  BALANCE_READ_REPOSITORY_TOKEN,
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
  UserMbtiController,
} from '@interface';
import { CqrsModule } from '@nestjs/cqrs';
import { AdjectiveExpressionEntity } from '@infrastructure/game/database/entity/cud/adjective-expression.entity';
import { BalanceListEntity } from '@infrastructure/game/database/entity/cud/balance-list.entity';
import { CommonQuestionEntity } from '@infrastructure/game/database/entity/cud/common-question.entity';
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
  CreateCommonQuestionCommandHandler,
  CreateUserAdjectiveExpressionHandler,
  CreateUserBalanceCommandHandler,
  CreateUserBalanceReadCommandHandler,
  CreateUserExpressionReadCommandHandler,
  CreateUserMbtiCommandHandler,
  NextCommonQuestionCommandHandler,
} from '../command';
import {
  AdjectiveExpressionService,
  UserBalanceService,
  UserMbtiService,
} from '../service';
import { EventModule } from '../../event';
import { GameSaga } from '../saga';
import { BalanceReadRepository } from '@infrastructure/game/database/repository/balance.repository-read';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdjectiveExpressionEntity,
      BalanceListEntity,
      CommonQuestionEntity,
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
    UserMbtiController,
  ],
  providers: [
    GameEventHandler,
    GetAdjectiveExpressionQueryHandler,
    CreateUserAdjectiveExpressionHandler,
    NextCommonQuestionCommandHandler,
    GetUsersAdjectiveExpressionQueryHandler,
    GetBalanceListQueryHandler,
    CreateCommonQuestionCommandHandler,
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
    {
      provide: ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
      useClass: AdjectiveExpressionRepository,
    },
    {
      provide: BALANCE_REPOSITORY_TOKEN,
      useClass: BalanceRepository,
    },
    {
      provide: USER_MBTI_REPOSITORY_TOKEN,
      useClass: UserMbtiRepository,
    },
    {
      provide: ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
      useClass: AdjectiveExpressionService,
    },
    {
      provide: USER_BALANCE_SERVICE_TOKEN,
      useClass: UserBalanceService,
    },
    {
      provide: USER_MBTI_SERVICE_TOKEN,
      useClass: UserMbtiService,
    },
    {
      provide: ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
      useClass: AdjectiveExpressionReadRepository,
    },
    {
      provide: BALANCE_READ_REPOSITORY_TOKEN,
      useClass: BalanceReadRepository,
    },
  ],
  exports: [],
})
export class GameModule {}
