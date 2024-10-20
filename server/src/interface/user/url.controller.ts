import {
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CountUsersInRoomQuery,
  CreateUrlCommand,
  GetUrlStatusQuery,
  UpdateStatusFalseCommand,
} from '@application';
import { JwtAuthGuard } from '@application/auth';
import {
  CountUserListInRoomResponseDto,
  GetUrlStatusResponseDto,
  SetUrlResponseDto,
  UserTokenDto,
} from './dto';
import {
  MaximumUrlException,
  NotFoundUrlException,
  StatusFalseUrlException,
  UpdateUrlException,
} from '@common';
import { UserToken } from './common';

/**
 * 개선 사항
 * 에러 핸들링
 * 유효성 검사
 */
@ApiTags('URL API')
@Controller('url')
@ApiCookieAuth('potenday_token')
export class UserUrlController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: '무작위 url이 반환됩니다.',
    type: SetUrlResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 에러 발생',
  })
  @ApiOperation({
    summary: 'url 발급',
  })
  @Post()
  async getUrl() {
    return await this.commandBus.execute(new CreateUrlCommand());
  }

  @ApiOperation({
    summary: '대기방 인원 수 확인',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CountUserListInRoomResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 에러 발생',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    type: NotFoundUrlException,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    type: StatusFalseUrlException,
  })
  @UseGuards(JwtAuthGuard)
  @Get('waiting-room')
  async countUserToWaitingRoom(@UserToken() user: UserTokenDto) {
    return await this.queryBus.execute(new CountUsersInRoomQuery(user.urlId));
  }

  @Patch('status')
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 에러 발생',
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UpdateUrlException,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    type: NotFoundUrlException,
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    type: MaximumUrlException,
  })
  @ApiOperation({
    summary: '[모두 모였어요] 버튼 클릭 시 상태 변경',
    description:
      '게임 시작 후 추가 인원을 더 이상 받지 않기 위해 URL의 상태를 변경합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async updateUrlStatus(@UserToken() user: UserTokenDto) {
    return this.commandBus.execute(new UpdateStatusFalseCommand(user.urlId));
  }

  @Get('status')
  @ApiOperation({
    summary: '방 입장여부',
    description: 'true - 입장 가능 , false - 입장 불가능',
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '서버 에러 발생',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '입장 가능 여부를 반환합니다.',
    type: GetUrlStatusResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  async checkUrlToStart(@UserToken() user: UserTokenDto) {
    return await this.queryBus.execute(new GetUrlStatusQuery(user.urlId));
  }
}
