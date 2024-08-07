import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  AdjectiveExpressionRepository,
  BALANCE_LIST_REPOSITORY_TOKEN,
  BalanceListRepository,
  COMMON_QUESTION_REPOSITORY_TOKEN,
  CommonQuestionRepository,
  USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  USER_BALANCE_REPOSITORY_TOKEN,
  UserAdjectiveExpressionRepository,
  UserBalanceRepository,
  UserMbtiRepository,
  USER_MBTI_REPOSITORY_TOKEN,
  USER_ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
  USER_BALANCE_SERVICE_TOKEN,
  USER_MBTI_SERVICE_TOKEN,
} from './infrastructure';
import {
  AdjectiveExpressionFactory,
  BalanceListFactory,
  GameNextFactory,
  UserAdjectiveExpressionFactory,
  UserBalanceFactory,
  UserMbtiFactory,
} from './domain';
import {
  CreateUserAdjectiveExpressionHandler,
  CreateUserBalanceCommandHandler,
  CreateUserMbtiCommandHandler,
  GameEventHandler,
  GetAdjectiveExpressionQueryHandler,
  GetBalanceListQueryHandler,
  GetBalanceResultQueryHandler,
  GetUserMbtiQueryHandler,
  GetUsersAdjectiveExpressionQueryHandler,
  GetUsersMbtiInUrlQueryHandler,
  UpdateCommonQuestionCommandHandler,
  UserAdjectiveExpressionService,
  UserBalanceService,
  UserMbtiService,
} from './application';
import {
  AdjectiveExpressionController,
  BalanceController,
  CommonQuestionController,
  UserMbtiController,
} from './interface';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommonQuestionCommandHandler } from './application';
import { UserAdjectiveExpressionEntity } from './infrastructure/database/entity/user-adjective-expression.entity';
import { UserMbtiEntity } from './infrastructure/database/entity/user-mbti.entity';
import { AdjectiveExpressionEntity } from './infrastructure/database/entity/adjective-expression.entity';
import { BalanceListEntity } from './infrastructure/database/entity/balance-list.entity';
import { CommonQuestionEntity } from './infrastructure/database/entity/common-question.entity';
import { UserBalanceEntity } from './infrastructure/database/entity/user-balance.entity';

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
    UserAdjectiveExpressionFactory,
    GameNextFactory,
    BalanceListFactory,
    UserBalanceFactory,
    UserMbtiFactory,
    {
      provide: ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
      useClass: AdjectiveExpressionRepository,
    },
    {
      provide: USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
      useClass: UserAdjectiveExpressionRepository,
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
      provide: USER_ADJECTIVE_EXPRESSION_SERVICE_TOKEN,
      useClass: UserAdjectiveExpressionService,
    },
    {
      provide: USER_BALANCE_SERVICE_TOKEN,
      useClass: UserBalanceService,
    },
    {
      provide: USER_MBTI_SERVICE_TOKEN,
      useClass: UserMbtiService,
    },
  ],
  exports: [],
})
export class GameModule {}
