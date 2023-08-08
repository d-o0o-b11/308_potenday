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
import { CreateGameKindDto } from './dto/create-game-kind.dto';

@ApiTags('[GAME] 형용사 표현 API')
@Controller('adjective-expression')
export class AdjectiveExpressionController {
  constructor(
    private readonly adjectiveExpressionService: AdjectiveExpressionService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[게임] 나를 표현할 수 있는 형용사를 선택해주세요',
    description: '모든 형용사 출력',
  })
  async getAllExpressionList() {
    return await this.adjectiveExpressionService.getAllExpressionList();
  }

  @Post()
  @ApiOperation({
    summary: '[게임] 개인이 형용사 표현 선택하는 과정',
  })
  async saveExpressionUser(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateGameKindDto,
  ) {
    return await this.adjectiveExpressionService.saveUserExpressionList(dto);
  }

  @Get(':url')
  @ApiOperation({
    summary: '[게임] 총 몇명이 형용사 표현 완료했는지 ',
    description:
      'finish_user: 형용사 표현 완료한 인원 수, next: false -> 아직 하고 있는 사람 존재 / true -> 모두 완료',
  })
  async getExpressionListUserCount(@Param('url') url: string) {
    return await this.adjectiveExpressionService.getExpressionListUserCount(
      url,
    );
  }

  @Get('list/:url')
  @ApiOperation({
    summary: '[게임] url에 있는 유저의 형용사 표현 출력 ',
  })
  async getExpressionListUserList(@Param('url') url: string) {
    return await this.adjectiveExpressionService.findUserAdjectiveExpressioList(
      url,
    );
  }
}
