import { Controller, Get } from '@nestjs/common';
import { GameKindService } from './game-kind.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('게임 API')
@Controller('game-kind')
export class GameKindController {
  constructor(private readonly gameKindService: GameKindService) {}

  @Get('adjective-expression')
  @ApiOperation({
    summary: '[게임] 나를 표현할 수 있는 형용사를 선택해주세요',
    description: '모든 형용사 출력',
  })
  async getAllExpressionList() {
    return await this.gameKindService.getAllExpressionList();
  }
}
