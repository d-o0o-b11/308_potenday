import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BalanceGameService } from '../service/balance-game.service';

@ApiTags('[GAME] 밸런스 게임 API')
@Controller('balance-game')
export class BalanceGameController {
  constructor(private readonly balanceGameService: BalanceGameService) {}
}
