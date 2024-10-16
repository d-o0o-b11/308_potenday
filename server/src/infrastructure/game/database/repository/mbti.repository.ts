import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserMbtiMapper } from '../mapper';
import { IMbtiRepository, MbtiFactory } from '@domain';
import { SaveUserMbtiDto, UserMbtiRawDto } from '@application';
import { DeleteMbtiException } from '@common';
import { UserMbtiEntity } from '../entity';

@Injectable()
export class MbtiRepository implements IMbtiRepository {
  constructor(
    private readonly manager: EntityManager,
    private readonly mbtiFactory: MbtiFactory,
  ) {}

  async create(dto: SaveUserMbtiDto) {
    return await this.manager.transaction(async (manager) => {
      const result = await manager.save(
        UserMbtiEntity,
        UserMbtiMapper.toEntity(dto.userId, dto.mbti, dto.toUserId),
      );

      return this.mbtiFactory.reconstitute(
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
