import {
  Body,
  Controller,
  HttpStatus,
  Post,
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
  setUserProfile(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: CreateUserCommandDto,
  ) {
    return this.commandBus.execute(
      new CreateUserCommand(dto.urlId, dto.imgId, dto.nickName),
    );
  }
}
