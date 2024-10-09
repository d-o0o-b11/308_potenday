import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindMbtiRoundDto,
  FindUserMbtiAnswerResponseDto,
  SaveMbtiDto,
} from './dto';
import {
  CreateUserMbtiCommand,
  GetUserMbtiQuery,
  GetUsersInRoomQuery,
  GetUsersMbtiInUrlQuery,
} from '@application';
import { FindOneUserInfoDto } from '@interface/user';

@ApiTags('[GAME] MBTI API')
@Controller('mbti')
export class MbtiController {
  constructor(
    private queryBus: QueryBus,
    private commandBud: CommandBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'mbti 해당 라운드 id => 추측 할 유저 정보 출력',
  })
  @ApiOkResponse({ type: FindOneUserInfoDto })
  async getUserInfoToROund(
    @Query(new ValidationPipe({ whitelist: true, transform: true }))
    dto: FindMbtiRoundDto,
  ) {
    return await this.queryBus.execute(
      new GetUsersInRoomQuery(dto.urlId, dto.roundId),
    );
  }

  @Post()
  @ApiOperation({
    summary: 'mbti 추측하기 또는 본인 mbti 저장하기',
    description: 'return true => 성공',
  })
  async saveUserMbti(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: SaveMbtiDto,
  ) {
    await this.commandBud.execute(
      new CreateUserMbtiCommand(dto.urlId, dto.userId, dto.mbti, dto.toUserId),
    );
  }

  @Get('result')
  @ApiOperation({
    summary: 'mbti 추측 결과 확인하기',
    description:
      '해당 라운드의 정답: user_mbti, 그 외의 유저들이 추측한 결과: user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindUserMbtiAnswerResponseDto,
  })
  async findResultUserMbti(
    @Query('urlId', ParseIntPipe) urlId: number,
    @Query('toUserId', ParseIntPipe) toUserId: number,
  ) {
    return await this.queryBus.execute(new GetUserMbtiQuery(urlId, toUserId));
  }

  @Get('final')
  @ApiOperation({
    summary: '[마지막] 전체 게임 결과 출력',
  })
  async finalAllUserData(@Query('urlId', ParseIntPipe) urlId: number) {
    return await this.queryBus.execute(new GetUsersMbtiInUrlQuery(urlId));
  }
}
