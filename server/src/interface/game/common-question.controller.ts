import {
  CreateCommonQuestionCommand,
  UpdateCommonQuestionCommand,
} from '@application';
import {
  Body,
  Controller,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
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

  @Patch('next')
  @ApiOperation({
    summary: '[공통질문] 다음으로 넘어가기',
    description:
      '총 4가지의 질문이 존재, 첫 질문 question_id=1 ....마지막 질문 id =4 // 성공 return true',
  })
  async nextPublicQuestion(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: PatchCommonQuestionDto,
  ) {
    await this.commandBus.execute(
      new UpdateCommonQuestionCommand(dto.urlId, dto.questionId),
    );
  }
}
