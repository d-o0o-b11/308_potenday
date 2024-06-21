import { Injectable } from '@nestjs/common';
import { CommonQuestionEntity } from '../entity';
import { EntityManager } from 'typeorm';
import { CommonQuestionMapper } from '../mapper';
import { ICommonQuestionRepository } from '@game/domain';

@Injectable()
export class CommonQuestionRepository implements ICommonQuestionRepository {
  constructor(private manager: EntityManager) {}

  async save(urlId: number) {
    return await this.manager.transaction(async (manager) => {
      const entity = CommonQuestionMapper.toEntity(urlId);
      await manager.save(CommonQuestionEntity, entity);
    });
  }

  async update(urlId: number, questionId: number) {
    return await this.manager.transaction(async (manager) => {
      const updateData = CommonQuestionMapper.toUpdateQuestionData(questionId);
      await manager.update(CommonQuestionEntity, urlId, updateData);
    });
  }
}
