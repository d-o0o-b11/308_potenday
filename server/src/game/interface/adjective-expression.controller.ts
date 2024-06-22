import {
  CreateUserAdjectiveExpressionCommand,
  GetAdjectiveExpressionQuery,
  GetUsersAdjectiveExpressionQuery,
} from '../application';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserAdjectiveExpressionDto,
  GroupByUserAdjectiveExpressionDto,
} from './dto';

@ApiTags('[GAME] 형용사 표현 API')
@Controller('adjective-expression2')
export class AdjectiveExpressionController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[게임] 나를 표현할 수 있는 형용사를 선택해주세요',
    description: '모든 형용사 표현을 조회합니다.',
  })
  async getAllExpressionList() {
    return await this.queryBus.execute(new GetAdjectiveExpressionQuery());
  }

  @Post()
  @ApiOperation({
    summary: '[게임] 개인이 형용사 표현 선택하는 과정',
  })
  async saveExpressionUser(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateUserAdjectiveExpressionDto,
  ) {
    return await this.commandBus.execute(
      new CreateUserAdjectiveExpressionCommand(
        dto.url,
        dto.urlId,
        dto.userId,
        dto.expressionIds,
      ),
    );
  }

  @Get('list')
  @ApiOperation({
    summary: '[게임] url에 있는 유저의 형용사 표현 출력 ',
  })
  @ApiQuery({
    name: 'urlId',
    example: '37',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GroupByUserAdjectiveExpressionDto],
  })
  async getExpressionListUserList(@Query('urlId') urlId: number) {
    return await this.queryBus.execute(
      new GetUsersAdjectiveExpressionQuery(urlId),
    );
  }
}
