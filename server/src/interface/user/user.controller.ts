import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserCommandDto, UserResponseDto } from './dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@application';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('USER API')
@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private commandBus: CommandBus,
  ) {}

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
    res.cookie(
      this.configService.get<string>('jwt.cookieHeader'),
      result.token,
      {
        httpOnly: true, // 클라이언트에서 접근 불가능
        secure: true, // HTTPS에서만 동작 (배포 시 활성화)
        maxAge: this.configService.get<number>('jwt.cookieExpire'), //  (토큰의 유효기간과 맞춤)
      },
    );

    return {
      id: result.id,
      imgId: result.imgId,
      name: result.name,
      urlId: result.urlId,
    };
  }
}
