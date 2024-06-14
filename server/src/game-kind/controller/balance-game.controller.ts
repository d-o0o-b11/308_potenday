import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BalanceGameService } from '../service/balance-game.service';
import { CreateBalanceGameDto } from '../dto/create-balance-game.dto';
import { FindBalanceGameDto } from '../dto/find-balance-game.dto';

@ApiTags('[GAME] 밸런스 게임 API')
@Controller('balance-game')
export class BalanceGameController {
  constructor(private readonly balanceGameService: BalanceGameService) {}

  @Get('list/:balance_id')
  @ApiOperation({
    summary: '각 밸런스 게임 질문지 출력',
    description: '밸런스 게임 질문지 4가지, balance_id == 질문지 숫자',
  })
  async getBalanceGame(@Param('balance_id', ParseIntPipe) balance_id: number) {
    return await this.balanceGameService.getBalanceGame(balance_id);
  }

  @Post()
  @ApiOperation({
    summary: '밸런스 게임 투표',
  })
  @ApiBody({
    type: CreateBalanceGameDto,
  })
  async saveBalanceGame(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateBalanceGameDto,
  ) {
    return await this.balanceGameService.saveBalanceGame(dto);
  }

  @Get()
  @ApiOperation({
    summary: '각 밸런스 게임 결과 보기',
  })
  async findBalanceGameUser(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: FindBalanceGameDto,
  ) {
    return await this.balanceGameService.findBalanceGameUser(dto);
  }
}
