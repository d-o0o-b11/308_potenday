import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserUrlMapper } from '../mapper';
import { IUserUrlRepository, UserFactory, UserUrlFactory } from '@domain';
import {
  CreateUserUrlDto,
  FindOneUserUrlWithUserDto,
  UpdateUserUrlDto,
} from '@interface';
import { UserUrlEntity } from '../entity/cud/user-url.entity';
import { UpdateException } from '@common';

@Injectable()
export class UserUrlRepository implements IUserUrlRepository {
  constructor(
    @InjectRepository(UserUrlEntity)
    private userUrlRepository: Repository<UserUrlEntity>,
    private userUrlFactory: UserUrlFactory,
    private userFactory: UserFactory,
  ) {}

  async save(dto: CreateUserUrlDto, manager: EntityManager) {
    const userUrlEntity = UserUrlMapper.toEntity(dto.url);
    const result = await manager.save(userUrlEntity);

    return this.userUrlFactory.reconstitute({
      id: result.id,
      url: result.url,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      deletedAt: result.deletedAt,
    });
  }

  async update(dto: UpdateUserUrlDto, manager: EntityManager) {
    const result = await manager.update(UserUrlEntity, dto.urlId, {
      status: dto.status,
    });

    if (!result.affected) {
      throw new UpdateException();
    }
  }

  //manager받도록 수정
  async findOneWithUser(dto: FindOneUserUrlWithUserDto) {
    const result = await this.userUrlRepository.findOneOrFail({
      where: {
        id: dto.urlId,
      },
      relations: {
        user: true,
      },
      order: {
        user: {
          createdAt: 'ASC',
        },
      },
    });

    const users = result.user.map((user) =>
      this.userFactory.reconstituteArray({
        id: user.id,
        imgId: user.imgId,
        nickName: user.nickName,
        urlId: user.urlId,
      }),
    );

    return this.userUrlFactory.reconstituteWithUser({
      id: result.id,
      url: result.url,
      status: result.status,
      users: users,
    });
  }

  delete(id: number, manager: EntityManager) {
    return manager.delete(UserUrlEntity, id);
  }
}
