import {
  CreateUserBalanceCommand,
  GetBalanceListQuery,
  GetBalanceResultQuery,
} from '../application';
import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBalanceDto, FindUserBalanceDto } from './dto';

@ApiTags('[GAME] 밸런스 게임 API')
@Controller('balance')
export class BalanceController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: '각 밸런스 게임 질문지 출력',
    description: '밸런스 게임 질문지 4가지, balance_id == 질문지 숫자',
  })
  async getBalanceGame(@Query('balanceId', ParseIntPipe) balanceId: number) {
    return await this.queryBus.execute(new GetBalanceListQuery(balanceId));
  }

  @Post()
  @ApiOperation({
    summary: '밸런스 게임 투표',
  })
  async saveBalanceGame(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateBalanceDto,
  ) {
    await this.commandBus.execute(
      new CreateUserBalanceCommand(
        dto.url,
        dto.urlId,
        dto.userId,
        dto.balanceId,
        dto.balanceType,
      ),
    );
  }

  @Get()
  @ApiOperation({
    summary: '각 밸런스 게임 결과 보기',
  })
  async findBalanceGameUser(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: FindUserBalanceDto,
  ) {
    return await this.queryBus.execute(
      new GetBalanceResultQuery(dto.urlId, dto.balanceId),
    );
  }
}
