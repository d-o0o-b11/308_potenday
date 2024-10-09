import { NextCommonQuestionCommand } from '@application';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatchCommonQuestionDto } from './dto';

@ApiTags('[GAME] 공통 질문 API')
@Controller('common-question')
export class CommonQuestionController {
  constructor(private commandBus: CommandBus) {}

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
