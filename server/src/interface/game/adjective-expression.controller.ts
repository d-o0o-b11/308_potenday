import {
  CreateUserAdjectiveExpressionCommand,
  GetAdjectiveExpressionQuery,
  GetUsersAdjectiveExpressionQuery,
} from '@application';
import { JwtAuthGuard } from '@application/auth';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserAdjectiveExpressionDto,
  GroupByUserAdjectiveExpressionDto,
  UserAdjectiveExpressionSubmitCountDto,
} from './dto';
import { UserToken, UserTokenDto } from '../user';

@ApiTags('[GAME] 형용사 표현 API')
@Controller('adjective-expression')
@ApiCookieAuth('potenday_token')
@UseGuards(JwtAuthGuard)
export class AdjectiveExpressionController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '[게임] 모든 형용사 표현을 조회합니다.',
  })
  async getAllExpressionList() {
    return await this.queryBus.execute(new GetAdjectiveExpressionQuery());
  }

  @Post()
  @ApiOperation({
    summary: '[게임] 개인이 형용사 표현 선택하는 과정',
  })
  @ApiResponse({
    type: UserAdjectiveExpressionSubmitCountDto,
  })
  async saveExpressionUser(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateUserAdjectiveExpressionDto,
    @UserToken() user: UserTokenDto,
  ) {
    return await this.commandBus.execute(
      new CreateUserAdjectiveExpressionCommand(
        user.urlId,
        user.userId,
        dto.expressionIdList,
      ),
    );
  }

  @Get()
  @ApiOperation({
    summary: '[게임] url에 있는 유저의 형용사 표현 출력 ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GroupByUserAdjectiveExpressionDto],
  })
  async getExpressionListUserList(@UserToken() user: UserTokenDto) {
    return await this.queryBus.execute(
      new GetUsersAdjectiveExpressionQuery(user.urlId),
    );
  }
}
