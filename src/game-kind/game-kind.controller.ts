import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { GameKindService } from './game-kind.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGameKindDto } from './dto/create-game-kind.dto';

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

  @Post('adjective-expression')
  @ApiOperation({
    summary: '[게임] 개인이 형용사 표현 선택하는 과정',
  })
  async saveExpressionUser(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateGameKindDto,
  ) {
    return await this.gameKindService.saveUserExpressionList(dto);
  }

  @Get('adjective-expression/:url')
  @ApiOperation({
    summary: '[게임] 총 몇명이 형용사 표현 완료했는지 ',
    description:
      'finish_user: 형용사 표현 완료한 인원 수, next: false -> 아직 하고 있는 사람 존재 / true -> 모두 완료',
  })
  async getExpressionListUserCount(@Param('url') url: string) {
    return await this.gameKindService.getExpressionListUserCount(url);
  }

  @Get('adjective-expression/list/:url')
  @ApiOperation({
    summary: '[게임] url에 있는 유저의 형용사 표현 출력 ',
  })
  async getExpressionListUserList(@Param('url') url: string) {
    return await this.gameKindService.findUserAdjectiveExpressioList(url);
  }
}
