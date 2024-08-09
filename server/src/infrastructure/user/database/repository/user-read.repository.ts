import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserReadDto } from '@interface';
import { UserFactory } from '@domain';
import { UserMapper } from '../mapper';
import { UserReadEntity } from '../entity/read/user-read.entity';

@Injectable()
export class UserReadRepository {
  constructor(private userFactory: UserFactory) {}

  create(dto: CreateUserReadDto, manager: EntityManager) {
    const userRead = this.userFactory.reconstituteRead(dto);
    const userReadEntity = UserMapper.toEntityRead(userRead);

    manager.save(userReadEntity);
  }

  async findList(userIdList: number[], manager: EntityManager) {
    const findPromises = userIdList.map(async (userId) => {
      const user = await manager
        .createQueryBuilder()
        .select('user_read.data', 'data')
        .from(UserReadEntity, 'user_read')
        .where("user_read.data->>'userId' = :userId", { userId })
        .getRawOne();

      return this.userFactory.reconstituteRead(
        new CreateUserReadDto(
          user.data.userId,
          user.data.imgId,
          user.data.nickname,
          user.data.urlId,
          user.data.createdAt,
          user.data.updatedAt,
          user.data.deletedAt,
          user.data.balance,
          user.data.mbti,
          user.data.adjectiveExpressionList,
        ),
      );
    });

    // 모든 Promise가 완료될 때까지 대기
    const findResult = await Promise.all(findPromises);
    return findResult;
  }
}
