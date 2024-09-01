import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IMbtiReadRepository, Mbti, UserMbtiFactory } from '@domain';
import { UserReadEntity } from '@infrastructure/user/database/entity/read/user-read.entity';
import {
  CreateMbtiReadDto,
  DeleteUserMbtiReadDto,
  FindSubmitMbtiUserDto,
  FindUserMbtiDto,
  UserMbtiRawDto,
} from '@application';
import {
  CreateMbtiException,
  DeleteMbtiException,
  NotFoundMbtiException,
} from '@common';

@Injectable()
export class MbtiReadRepository implements IMbtiReadRepository {
  constructor(private readonly userMbtiFactory: UserMbtiFactory) {}

  async create(dto: CreateMbtiReadDto, manager: EntityManager) {
    const { mbtiId, userId, mbti, toUserId, createdAt } = dto;

    const mbtiList = {
      mbtiId: mbtiId,
      mbti: mbti,
      toUserId: toUserId,
      createdAt: createdAt,
    };

    const result = await manager
      .createQueryBuilder()
      .update(UserReadEntity)
      .set({
        data: () =>
          `jsonb_set(
          data, 
          '{mbtiList}', 
          (CASE 
            WHEN data->'mbtiList' IS NULL 
            THEN '[]' 
            ELSE data->'mbtiList' 
          END) || '${JSON.stringify(mbtiList)}'::jsonb, 
          true
        )`,
      })
      .where("data->>'userId' = :userId", { userId })
      .execute();

    if (!result.affected) {
      throw new CreateMbtiException();
    }
  }

  async isSubmitUser(dto: FindSubmitMbtiUserDto, manager: EntityManager) {
    const user = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select(["data->'mbti' AS mbti"])
      .where("data->>'userId' = :userId", { userId: dto.userId })
      .getRawOne();

    // mbti가 존재하지 않으면 false 반환
    if (!user || !user.mbti) {
      return false;
    }

    // mbti 배열에서 toUserId가 일치하는 항목을 찾음
    const mbtiList = user.mbti as Mbti[];
    const hasMbti = mbtiList.some((mbti) => mbti.toUserId === dto.toUserId);

    // toUserId가 존재하면 true, 그렇지 않으면 false 반환
    return hasMbti;
  }

  async findUserCount(dto: FindUserMbtiDto, manager: EntityManager) {
    const usersWithMatchingMbti = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select('COUNT(*)', 'count') // 일치하는 유저의 수를 세기 위해 COUNT 사용
      .where("data->>'urlId' = :urlId", { urlId: dto.urlId }) // urlId에 해당하는 유저 조회
      .andWhere("data->'mbti' IS NOT NULL") // balance 배열이 있는 유저만 조회
      .andWhere(
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'mbti') AS mbti
          WHERE mbti->>'toUserId' = :toUserId
        )
      `,
        { toUserId: dto.toUserId },
      ) // mbti 배열에 dto.toUserId가 존재하는지 확인
      .getRawOne(); // 조회 결과를 가져옴

    return { count: usersWithMatchingMbti.count };
  }

  async find(urlId: number, manager: EntityManager) {
    const mbtiList = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select([
        "data->'userId' AS user_id",
        "data->'nickname' AS nick_name",
        "data->'imgId' AS img_id",
        "data->'mbtiList' AS mbti_list",
      ])
      .where("data->>'urlId' = :urlId", { urlId: urlId })
      .getRawMany();

    const result = mbtiList.map((user) => {
      const matchingMbti = user.mbti_list.find(
        (mbti) => mbti.toUserId === user.user_id,
      );

      return this.userMbtiFactory.reconstitute(
        new UserMbtiRawDto(
          null,
          user.user_id,
          matchingMbti.mbti ?? null,
          null,
          user.nick_name,
          user.img_id,
        ),
      );
    });

    return result;
  }

  async findSubmitList(dto: FindUserMbtiDto, manager: EntityManager) {
    const usersWithMatchingMbti = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select([
        "data->'userId' AS user_id",
        "data->'nickname' AS nick_name",
        "data->'imgId' AS img_id",
        "data->'mbtiList' AS mbti_list",
      ])
      .where("data->>'urlId' = :urlId", { urlId: dto.urlId })
      .andWhere(
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'mbtiList') AS mbti
          WHERE mbti->>'toUserId' = :toUserId
        )
      `,
        { toUserId: dto.toUserId },
      )
      .getRawMany();

    const result = usersWithMatchingMbti.map((user) => {
      const filteredMbti = user.mbti_list.filter(
        (mbti: any) => mbti.toUserId === dto.toUserId,
      );

      return this.userMbtiFactory.reconstitute(
        new UserMbtiRawDto(
          null,
          user.user_id,
          filteredMbti[0].mbti,
          dto.toUserId,
          user.nick_name,
          user.img_id,
        ),
      );
    });

    return result;
  }

  async delete(dto: DeleteUserMbtiReadDto, manager: EntityManager) {
    const { mbtiId, userId } = dto;

    const user = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select("user.data->'mbti' AS mbti")
      .where("user.data->>'userId' = :userId", { userId })
      .getRawOne();

    if (!user || !user.mbti) {
      throw new NotFoundMbtiException();
    }

    const mbtis: Mbti[] = JSON.parse(user.mbti);

    const updatedMbtis = mbtis.filter((mbti) => mbti.mbtiId !== mbtiId);

    const result = await manager
      .createQueryBuilder()
      .update(UserReadEntity)
      .set({
        data: () =>
          `jsonb_set(data, '{mbtiList}', '${JSON.stringify(
            updatedMbtis,
          )}'::jsonb, false)`,
      })
      .where("data->>'userId' = :userId", { userId })
      .execute();

    if (!result.affected) {
      throw new DeleteMbtiException();
    }

    return result;
  }
}
