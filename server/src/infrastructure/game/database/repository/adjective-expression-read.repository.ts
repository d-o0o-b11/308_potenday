import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  AdjectiveExpressionFactory,
  IAdjectiveExpressionRepositoryReadRepository,
} from '@domain';
import { UserReadEntity } from '@infrastructure/user/database/entity/read/user-read.entity';
import {
  CreateUserAdjectiveExpressionReadDto,
  FindUserAdjectiveExpressionReadDto,
} from '@application';
import {
  DeleteAdjectiveExpressionException,
  UpdateAdjectiveExpressionException,
} from '@common';

@Injectable()
export class AdjectiveExpressionReadRepository
  implements IAdjectiveExpressionRepositoryReadRepository
{
  constructor(
    private readonly adjectiveExpressionFactory: AdjectiveExpressionFactory,
  ) {}

  async create(
    dto: CreateUserAdjectiveExpressionReadDto,
    manager: EntityManager,
  ) {
    const { expressionIdList, userId, createdAt } = dto;
    // `expressionIds`를 json 배열로 변환
    // const expressionIdsJson = JSON.stringify(expressionIds);
    const adjectiveExpression = {
      adjectiveExpressionIdList: expressionIdList,
      createdAt: createdAt,
    };

    //jsonb_set 함수는 JSON 값을 받아 들임, 그래서 JSON 형식이 아닌 값이 제공되면 오류 발생
    //expressionIdList가 숫자나 배열이라면, 이 값이 자동으로 JSON 문자열로 변환되지 않는다!ㄴ
    const result = await manager
      .createQueryBuilder()
      .update(UserReadEntity)
      .set({
        data: () =>
          `jsonb_set(data, '{adjectiveExpression}', '${JSON.stringify(
            adjectiveExpression,
          )}'::jsonb, true)`,
      })
      .where("data->>'userId' = :userId", { userId })
      .execute();

    if (!result.affected) {
      throw new UpdateAdjectiveExpressionException();
    }
  }

  async delete(userId: number, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder()
      .update(UserReadEntity)
      .set({
        data: () => `data - 'adjectiveExpressionList'`,
      })
      .where("data->>'userId' = :userId", { userId })
      .execute();

    if (!result.affected) {
      throw new DeleteAdjectiveExpressionException();
    }

    return result;
  }

  async isSubmitUser(userId: number, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select(
        "data->'adjectiveExpression' IS NOT NULL",
        'hasAdjectiveExpression',
      )
      .where("data->>'userId' = :userId", { userId })
      .getRawOne();

    return result?.hasAdjectiveExpression || false;
  }

  async findUsersByUrlId(urlId: number, manager: EntityManager) {
    const userList = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select([
        "data->>'userId' AS id",
        "data->>'nickname' AS nickname",
        "data->>'imgId' AS imgId",
        "data->'adjectiveExpression' AS adjectiveExpression",
      ])
      .where("data->>'urlId' = :urlId", { urlId })
      // 추가된 조건: adjectiveExpression이 존재하고 값이 있는 유저만 조회
      .andWhere("data->'adjectiveExpression' IS NOT NULL")
      .andWhere("data->'adjectiveExpression'->>'createdAt' IS NOT NULL") // createdAt이 존재하는지 확인
      .andWhere(
        "jsonb_array_length(data->'adjectiveExpression'->'adjectiveExpressionIdList') > 0",
      ) // 배열이 비어있지 않은지 확인
      .orderBy("data->>'userId'", 'ASC')
      .getRawMany();

    const result = userList.map((user) => {
      return this.adjectiveExpressionFactory.reconstituteAdjectiveExpressionRead(
        new FindUserAdjectiveExpressionReadDto(
          Number(user.id),
          Number(user.imgid),
          user.nickname,
          Number(urlId),
          user.adjectiveexpression,
        ),
      );
    });

    return result;
  }
}
