import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserUrlMapper } from '../mapper';
import { IUrlRepository, UserFactory, UrlFactory } from '@domain';
import {
  CreateUserUrlDto,
  FindOneUserUrlWithUserDto,
  UpdateUserUrlDto,
} from '@interface';
import { UserUrlEntity } from '../entity/cud/user-url.entity';
import { UpdateException } from '@common';

@Injectable()
export class UserUrlRepository implements IUrlRepository {
  constructor(
    private readonly urlFactory: UrlFactory,
    private readonly userFactory: UserFactory,
  ) {}

  async save(dto: CreateUserUrlDto, manager: EntityManager) {
    const userUrlEntity = UserUrlMapper.toEntity(dto.url);
    const result = await manager.save(userUrlEntity);

    return this.urlFactory.reconstitute({
      id: result.id,
      url: result.url,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      deletedAt: result.deletedAt,
    });
  }

  async update(urlId: number, dto: UpdateUserUrlDto, manager: EntityManager) {
    const result = await manager.update(UserUrlEntity, urlId, {
      status: dto.status,
    });

    if (!result.affected) {
      throw new UpdateException();
    }

    return result;
  }

  async delete(id: number, manager: EntityManager) {
    const result = await manager.delete(UserUrlEntity, id);

    if (!result.affected) {
      throw new Error('url 삭제과정에서 에러 발생');
    }

    return result;
  }

  //mbti 컨트롤러 수정 시 제거해야함 -> find는 read DB로 가야함
  async findOneWithUser(
    dto: FindOneUserUrlWithUserDto,
    manager: EntityManager,
  ) {
    const result = await manager.findOneOrFail(UserUrlEntity, {
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

    return this.urlFactory.reconstituteWithUser({
      id: result.id,
      url: result.url,
      status: result.status,
      users: users,
    });
  }
}
