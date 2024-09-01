import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserMbtiMapper } from '../mapper';
import { IMbtiRepository, UserMbtiFactory } from '@domain';
import { UserMbtiEntity } from '../entity/cud/user-mbti.entity';
import { SaveUserMbtiDto, UserMbtiRawDto } from '@application';
import { DeleteMbtiException } from '@common';

@Injectable()
export class MbtiRepository implements IMbtiRepository {
  constructor(
    private manager: EntityManager,
    private readonly userMbtiFactory: UserMbtiFactory,
  ) {}

  async create(dto: SaveUserMbtiDto) {
    return await this.manager.transaction(async (manager) => {
      const result = await manager.save(
        UserMbtiEntity,
        UserMbtiMapper.toEntity(dto.userId, dto.mbti, dto.toUserId),
      );

      return this.userMbtiFactory.reconstitute(
        new UserMbtiRawDto(
          result.id,
          result.userId,
          result.mbti,
          result.toUserId,
          null,
          null,
        ),
      );
    });
  }

  async delete(id: number, manager: EntityManager) {
    const result = await manager.softDelete(UserMbtiEntity, id);

    if (!result.affected) {
      throw new DeleteMbtiException();
    }

    return result;
  }
}
