import { Injectable } from '@nestjs/common';
import { IUserRepository, UserFactory } from '@domain';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '@interface';
import { UserMapper } from '../mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private manager: EntityManager,
    private userFactory: UserFactory,
  ) {}

  async save(dto: CreateUserDto) {
    return await this.manager.transaction(async (manager) => {
      const userEntity = UserMapper.toEntity(dto);
      const result = await manager.save(userEntity);

      const user = this.userFactory.create({
        userId: result.id,
        imgId: result.imgId,
        urlId: result.urlId,
        nickName: result.nickName,
      });

      return {
        id: user.getId(),
        imgId: user.getImgId(),
        nickName: user.getNickName(),
        urlId: user.getUrlId(),
      };
    });
  }
}
