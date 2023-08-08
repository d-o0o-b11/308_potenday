import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AdjectiveExpressionService } from './adjective-expression.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('[GAME] 밸런스 게임 API')
@Controller('balance-game')
export class AdjectiveExpressionController {
  constructor(
    private readonly adjectiveExpressionService: AdjectiveExpressionService,
  ) {}
}
