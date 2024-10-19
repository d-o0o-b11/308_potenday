import { NextCommonQuestionCommand } from '@application';
import { JwtAuthGuard } from '@application/auth';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserToken, UserTokenDto } from '@interface/user';

@ApiTags('[GAME] 공통 질문 API')
@Controller('common-question')
@ApiCookieAuth('potenday_token')
@UseGuards(JwtAuthGuard)
export class CommonQuestionController {
  constructor(private commandBus: CommandBus) {}

  @Post('next')
  @ApiOperation({
    summary: '[공통질문] 다음으로 넘어가기',
  })
  async nextPublicQuestion(@UserToken() user: UserTokenDto) {
    await this.commandBus.execute(new NextCommonQuestionCommand(user.urlId));
  }
}
