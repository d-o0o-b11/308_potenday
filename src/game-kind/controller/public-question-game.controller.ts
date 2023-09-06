import { Body, Controller, Patch, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateQuestionStatusDto } from '../dto/update-question-status.dto';
import { PublicQuestionGameService } from '../service/pubilc-question.service';

@ApiTags('[GAME] 공통 질문 API')
@Controller('public-question')
export class PublicQuestionGameController {
  constructor(
    private readonly publicQuestionGameService: PublicQuestionGameService,
  ) {}

  @Patch('public-question')
  @ApiOperation({
    summary: '[공통질문] 다음으로 넘어가기',
    description:
      '총 4가지의 질문이 존재, 첫 질문 question_id=1 ....마지막 질문 id =4 // 성공 return true',
  })
  async nextPublicQuestion(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: UpdateQuestionStatusDto,
  ) {
    return await this.publicQuestionGameService.nextPublicQuestion(dto);
  }
}
