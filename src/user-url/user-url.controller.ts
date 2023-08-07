import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserUrlService } from './user-url.service';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserUrlDto } from './dto/create-user-url.dto';

@ApiTags('URL 생성, 입장 API')
@Controller('user-url')
export class UserUrlController {
  constructor(private readonly userUrlService: UserUrlService) {}

  @Get()
  @ApiOperation({
    summary: '랜덤 url 발급받기',
  })
  async getRandomUrl() {
    return await this.userUrlService.setUrl();
  }

  @Post('check-in')
  @ApiOperation({
    summary: '해당 링크 들어왔을 때 닉네임으로 가입하기',
    description: '이미지 id, 닉네임, url body에 실어서 요청하기',
  })
  @ApiBody({
    type: CreateUserUrlDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 url입니다.' })
  async setUserProfile(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateUserUrlDto,
  ) {
    try {
      return await this.userUrlService.saveUserProfileToUrl(dto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @ApiOperation({
    summary: '대기방 인원 수 확인',
  })
  @Get('waiting-room/:url')
  async countUserToWaitingRoom(@Param('url') url: string) {
    return this.userUrlService.countUserToWaitingRoom(url);
  }

  @Patch('status/:url')
  @ApiOperation({
    summary: '[모두 모였어요]버튼 클릭 시 상태 변경',
    description: '시작되면 더 이상의 인원 수 추가는 받지 않기 위한 api',
  })
  async updateUrlStatus(@Param('url') url: string) {
    try {
      return await this.userUrlService.updateStatusFalse(url);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
