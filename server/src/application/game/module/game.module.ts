import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BALANCE_LIST_REPOSITORY_TOKEN,
  BalanceListRepository,
  COMMON_QUESTION_REPOSITORY_TOKEN,
  CommonQuestionRepository,
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  USER_BALANCE_REPOSITORY_TOKEN,
  AdjectiveExpressionRepository,
  UserBalanceRepository,
  UserMbtiRepository,
  USER_MBTI_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
  USER_BALANCE_SERVICE_TOKEN,
  USER_MBTI_SERVICE_TOKEN,
  AdjectiveExpressionReadRepository,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import {
  AdjectiveExpressionFactory,
  BalanceListFactory,
  UserBalanceFactory,
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
  CreateUserExpressionReadCommandHandler,
  CreateUserMbtiCommandHandler,
  UpdateCommonQuestionCommandHandler,
} from '../command';
import {
  AdjectiveExpressionService,
  UserBalanceService,
  UserMbtiService,
} from '../service';
import { EventModule } from '../../event';
import { GameSaga } from '../saga';

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
    UpdateCommonQuestionCommandHandler,
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
    UserBalanceFactory,
    UserMbtiFactory,
    GameSaga,
    EventGameRollbackHandler,
    CreateUserExpressionReadCommandHandler,
    {
      provide: ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
      useClass: AdjectiveExpressionRepository,
    },
    {
      provide: COMMON_QUESTION_REPOSITORY_TOKEN,
      useClass: CommonQuestionRepository,
    },
    {
      provide: BALANCE_LIST_REPOSITORY_TOKEN,
      useClass: BalanceListRepository,
    },
    {
      provide: USER_BALANCE_REPOSITORY_TOKEN,
      useClass: UserBalanceRepository,
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
  ],
  exports: [],
})
export class GameModule {}
