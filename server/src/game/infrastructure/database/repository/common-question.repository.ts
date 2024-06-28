import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CommonQuestionMapper } from '../mapper';
import { ICommonQuestionRepository } from '../../../domain';
import {
  PatchCommonQuestionDto,
  SaveCommonQuestionDto,
} from '../../../interface';
import { CommonQuestionEntity } from '../entity/common-question.entity';

@Injectable()
export class CommonQuestionRepository implements ICommonQuestionRepository {
  constructor(private manager: EntityManager) {}

  async save(dto: SaveCommonQuestionDto) {
    return await this.manager.transaction(async (manager) => {
      const entity = CommonQuestionMapper.toEntity(dto.urlId);
      await manager.save(CommonQuestionEntity, entity);
    });
  }

  async update(dto: PatchCommonQuestionDto) {
    return await this.manager.transaction(async (manager) => {
      const updateData = CommonQuestionMapper.toUpdateQuestionData(
        dto.questionId,
      );
      await manager.update(CommonQuestionEntity, dto.urlId, updateData);
    });
  }
}
