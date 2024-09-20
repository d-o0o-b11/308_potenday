import { Injectable } from '@nestjs/common';
import { IUserRepository, UserFactory } from '@domain';
import { EntityManager } from 'typeorm';
import { UserMapper } from '../mapper';
import { InjectEntityManager } from '@nestjs/typeorm';
// import { UserEntity } from '../entity/cud/user.entity';
import { CreateUserDto } from '@application';
import { DeleteUserException } from '@common';
import { UserEntity } from '../entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly userFactory: UserFactory,
  ) {}

  async create(dto: CreateUserDto) {
    return await this.manager.transaction(async (manager) => {
      const userEntity = UserMapper.toEntity(dto);
      const result = await manager.save(userEntity);

      return this.userFactory.create({
        userId: result.id,
        imgId: result.imgId,
        urlId: result.urlId,
        nickName: result.nickName,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      });
    });
  }

  async delete(id: number, manager: EntityManager) {
    const result = await manager.delete(UserEntity, id);

    if (!result.affected) throw new DeleteUserException();

    return result;
  }
}
