import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  AdjectiveExpressionEntity,
  AdjectiveExpressionRepository,
  BALANCE_LIST_REPOSITORY_TOKEN,
  BalanceListEntity,
  BalanceListRepository,
  COMMON_QUESTION_REPOSITORY_TOKEN,
  CommonQuestionEntity,
  CommonQuestionRepository,
  UserMbtiEntity,
  USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  USER_BALANCE_REPOSITORY_TOKEN,
  UserAdjectiveExpressionEntity,
  UserAdjectiveExpressionRepository,
  UserBalanceEntity,
  UserBalanceRepository,
  UserMbtiRepository,
  USER_MBTI_REPOSITORY_TOKEN,
} from './infrastructure';
import {
  AdjectiveExpressionFactory,
  BalanceListFactory,
  GameNextFactory,
  UserBalanceFactory,
  UserMbtiFactory,
} from './domain';
import {
  CreateUserAdjectiveExpressionHandler,
  CreateUserBalanceCommandHandler,
  CreateUserMbtiCommandHandler,
  GameEventHandler,
  GetAdjectiveExpressionQueryHandler,
  GetBalanceResultQueryHandler,
  GetUserMbtiQueryHandler,
  GetUsersAdjectiveExpressionQueryHandler,
  GetUsersMbtiInUrlQueryHandler,
  UpdateCommonQuestionCommandHandler,
} from './application';
import {
  AdjectiveExpressionController,
  BalanceController,
  CommonQuestionController,
  UserMbtiController,
} from './interface';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommonQuestionCommandHandler } from './application';
import { GetBalanceListQueryHandler } from './application/query/get-balance-list.handler';

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
  ],
  exports: [],
})
export class GameModule {}
