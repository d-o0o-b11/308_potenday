import {
  CreateUserBalanceCommand,
  GetBalanceListQuery,
  GetBalanceResultQuery,
} from '@application';
import { JwtAuthGuard } from '@application/auth';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CalculatePercentagesResponseDto, CreateBalanceDto } from './dto';
import { UserToken, UserTokenDto } from '../user';

@ApiTags('[GAME] 밸런스 게임 API')
@Controller('balance')
@ApiCookieAuth('potenday_token')
@UseGuards(JwtAuthGuard)
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
    @UserToken() user: UserTokenDto,
  ) {
    await this.commandBus.execute(
      new CreateUserBalanceCommand(
        user.urlId,
        user.userId,
        dto.balanceId,
        dto.balanceType,
      ),
    );
  }

  @Get()
  @ApiOperation({
    summary: '각 밸런스 게임 결과 보기',
  })
  @ApiQuery({
    name: 'balanceId',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CalculatePercentagesResponseDto],
  })
  async findBalanceGameUser(
    @Query('balanceId', ParseIntPipe) balanceId: number,
    @UserToken() user: UserTokenDto,
  ) {
    return await this.queryBus.execute(
      new GetBalanceResultQuery(user.urlId, balanceId),
    );
  }
}
