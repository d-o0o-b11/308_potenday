import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MbtiPredictionService } from '../service/mbti-prediction.service';
import { FindMbtiRoundDto } from '../dto/find-mbti-round.dto';
import { SaveMbtiRoundDto } from '../dto/save-mbti-round.dto';

@ApiTags('[GAME] MBTI API')
@Controller('mbti')
export class MbtiPredictionController {
  constructor(private readonly mbtiPredictionService: MbtiPredictionService) {}

  @Get()
  @ApiOperation({
    summary: 'mbti 해당 라운드 id => 추측 할 유저 정보 출력',
  })
  async getUserInfoToROund(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: FindMbtiRoundDto,
  ) {
    return await this.mbtiPredictionService.getMbtiRound(dto);
  }

  @Post()
  @ApiOperation({
    summary: 'mbti 추측하기 또는 본인 mbti 저장하기',
    description: 'return true => 성공',
  })
  async saveUserMbti(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: SaveMbtiRoundDto,
  ) {
    return await this.mbtiPredictionService.saveUserMbti(dto);
  }

  @Get('result')
  @ApiOperation({
    summary: 'mbti 추측 결과 확인하기',
    description:
      '해당 라운드의 정답: user_mbti, 그 외의 유저들이 추측한 결과: user',
  })
  async findResultUserMbti(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: FindMbtiRoundDto,
  ) {
    return await this.mbtiPredictionService.getResultMbtiRound(dto);
  }
}
