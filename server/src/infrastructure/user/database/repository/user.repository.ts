import { Injectable } from '@nestjs/common';
import { IUserRepository, UserFactory } from '@domain';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '@interface';
import { UserMapper } from '../mapper';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private userFactory: UserFactory,
  ) {}

  async create(dto: CreateUserDto) {
    return await this.manager.transaction(async (manager) => {
      const userEntity = UserMapper.toEntity(dto);
      const result = await manager.save(userEntity);

      const user = this.userFactory.create({
        userId: result.id,
        imgId: result.imgId,
        urlId: result.urlId,
        nickName: result.nickName,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        deletedAt: result.deletedAt,
      });

      return user;
    });
  }
}
