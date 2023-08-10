import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonQuestionEntity } from '../entities/common-question.entity';
import { UpdateQuestionStatusDto } from '../dto/update-question-status.dto';
import { UserUrlService } from 'src/user-url/user-url.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PublicQuestionGameService {
  constructor(
    @InjectRepository(CommonQuestionEntity)
    private readonly commonQuestionEntityRepository: Repository<CommonQuestionEntity>,

    private readonly userUrlService: UserUrlService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  //공통 질문 다음으로 넘어가기
  async nextPublicQuestion(dto: UpdateQuestionStatusDto) {
    const findOneResult = await this.userUrlService.findUrlId(dto.url);

    if (dto.question_id === 1) {
      await this.commonQuestionEntityRepository.save({
        url_id: findOneResult.id,
      });
    }

    const updates: { [key: number]: Partial<CommonQuestionEntity> } = {
      1: { question_1: true },
      2: { question_2: true },
      3: { question_3: true },
      4: { question_4: true },
    };

    const updateColumns = updates[dto.question_id];

    if (updateColumns) {
      await this.commonQuestionEntityRepository.update(
        findOneResult.id,
        updateColumns,
      );
    }

    this.eventEmitter.emit('statusUpdated', { url: dto.url, status: true });

    return true;
  }

  //공통 질문 현재 페이지 찾기
  async findQuestionStatus(dto: UpdateQuestionStatusDto) {
    const findOneResuelt = await this.userUrlService.findUrlId(dto.url);

    const updates: { [key: number]: string } = {
      1: 'question_1',
      2: 'question_2',
      3: 'question_3',
      4: 'squestion_4',
    };

    const updateColumns = updates[dto.question_id];

    const findQuestionStatus =
      await this.commonQuestionEntityRepository.findOne({
        where: {
          url_id: findOneResuelt.id,
        },
      });

    if (findQuestionStatus[updateColumns]) {
      return true;
    } else {
      return false;
    }
  }
}
