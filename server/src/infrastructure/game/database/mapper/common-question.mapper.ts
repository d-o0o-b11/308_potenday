import { CommonQuestionEntity } from '../entity/common-question.entity';

export class CommonQuestionMapper {
  static toEntity(urlId: number): CommonQuestionEntity {
    const entity = new CommonQuestionEntity();
    entity.urlId = urlId;
    return entity;
  }

  static toUpdateQuestionData(
    questionId: number,
  ): Partial<CommonQuestionEntity> {
    const updateData: Partial<CommonQuestionEntity> = {};

    switch (questionId) {
      case 1:
        updateData.question1 = true;
        break;
      case 2:
        updateData.question2 = true;
        break;
      case 3:
        updateData.question3 = true;
        break;
      case 4:
        updateData.question4 = true;
        break;
      default:
        throw new Error(`존재하지 않는 Id: ${questionId} 입니다.`);
    }

    return updateData;
  }
}
