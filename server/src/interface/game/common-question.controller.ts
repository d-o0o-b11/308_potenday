import {
  CreateCommonQuestionCommand,
  NextCommonQuestionCommand,
} from '@application';
import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatchCommonQuestionDto } from './dto';

@ApiTags('[GAME] 공통 질문 API')
@Controller('common-question')
export class CommonQuestionController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  @ApiOperation({
    summary: '공통 질문 들어가기 전 초기 세팅',
  })
  async settingCommonQuestion(@Query('urlId') urlId: number) {
    await this.commandBus.execute(new CreateCommonQuestionCommand(urlId));
  }

  @Post('next')
  @ApiOperation({
    summary: '[공통질문] 다음으로 넘어가기',
  })
  async nextPublicQuestion(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: PatchCommonQuestionDto,
  ) {
    await this.commandBus.execute(new NextCommonQuestionCommand(dto.urlId));
  }
}
