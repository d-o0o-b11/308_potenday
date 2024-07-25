import {
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CountUsersInRoomQuery,
  GetUrlQuery,
  GetUrlStatusQuery,
  NextStepCommand,
  UpdateStatusFalseCommand,
} from '@application';
import { CountUsersInRoomResponseDto, GetUrlStatusResponseDto } from './dto';

@ApiTags('URL API')
@Controller('url')
export class UserUrlController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: '무작위 url이 반환됩니다.',
    type: String,
  })
  @ApiOperation({
    summary: 'url 발급',
  })
  @Get()
  async getUrl() {
    return await this.queryBus.execute(new GetUrlQuery());
  }

  @ApiOperation({
    summary: '대기방 인원 수 확인',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CountUsersInRoomResponseDto,
  })
  @ApiQuery({
    name: 'urlId',
    example: 11,
  })
  @Get('waiting-room')
  async countUserToWaitingRoom(@Query('urlId', ParseIntPipe) urlId: number) {
    return await this.queryBus.execute(new CountUsersInRoomQuery(urlId));
  }

  @Patch('status')
  @ApiOperation({
    summary: '[모두 모였어요] 버튼 클릭 시 상태 변경',
    description:
      '시작되면 더 이상의 인원 수 추가는 받지 않기 위한 api, return true -> 변경 성공',
  })
  @ApiQuery({
    name: 'urlId',
    example: 11,
  })
  async updateUrlStatus(@Query('urlId', ParseIntPipe) urlId: number) {
    return this.commandBus.execute(new UpdateStatusFalseCommand(urlId));
  }

  @Get('status')
  @ApiOperation({
    summary: '방 입장여부',
    description: 'true - 입장 가능 , false - 입장 불가능',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '입장 가능 여부를 반환합니다.',
    type: GetUrlStatusResponseDto,
  })
  @ApiQuery({
    name: 'urlId',
    example: 11,
  })
  async checkUrlToStart(@Query('urlId', ParseIntPipe) urlId: number) {
    return await this.queryBus.execute(new GetUrlStatusQuery(urlId));
  }

  @Post('next')
  @ApiOperation({
    summary: '다음 게임으로 넘어가기',
  })
  @ApiQuery({
    name: 'urlId',
    example: 11,
  })
  async nextToGame(@Query('urlId', ParseIntPipe) urlId: number) {
    return await this.commandBus.execute(new NextStepCommand(urlId));
  }
}
