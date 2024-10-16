import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserCommandDto, UserResponseDto, UserTokenDto } from './dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@application';
import { JwtAuthGuard } from '@application/auth';
import { Response, Request } from 'express';
import { Cookies } from '@common';
import { UserToken } from './common';

@ApiTags('USER API')
@Controller('user')
export class UserController {
  constructor(private commandBus: CommandBus) {}

  @Post('check-in')
  @ApiOperation({
    summary: '닉네임 설정 및 성격 유형 검사 후 입장',
    description: `
  - 간단한 **성격 유형 검사**를 완료하고 **닉네임을 설정**한 후,
  - **온보딩 절차**를 거쳐 **대기방에 입장**합니다.
    `,
  })
  @ApiBody({
    type: CreateUserCommandDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 url입니다.' })
  async setUserProfile(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateUserCommandDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.commandBus.execute(
      new CreateUserCommand(dto.urlId, dto.imgId, dto.name),
    );

    // 쿠키에 토큰 설정
    res.cookie('potenday_token', result.token, {
      httpOnly: true, // 클라이언트에서 접근 불가능
      secure: true, // HTTPS에서만 동작 (배포 시 활성화)
      maxAge: 3600000, // 1시간 (토큰의 유효기간과 맞춤)
    });

    return {
      id: result.id,
      imgId: result.imgId,
      name: result.name,
      urlId: result.urlId,
    };
  }

  @ApiOperation({
    summary: '쿠키 설정 확인 테스트 API',
    deprecated: true,
  })
  @ApiCookieAuth('potenday_token')
  @Get('check')
  checkCookie(@Req() req: Request) {
    const cookieName = 'potenday_token'; // 확인할 쿠키 이름
    const cookieValue = req.cookies[cookieName];

    return cookieValue;
  }

  @Get('check2')
  @ApiCookieAuth('potenday_token')
  @UseGuards(JwtAuthGuard)
  checkCookie2(
    @Cookies('potenday_token') name: string,
    @UserToken() user: UserTokenDto,
  ) {
    return user;
  }
}
