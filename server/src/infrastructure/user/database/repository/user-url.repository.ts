import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserUrlMapper } from '../mapper';
import { IUserUrlRepository, UserFactory, UserUrlFactory } from '@domain';
import {
  CreateUserUrlDto,
  FindOneUserUrlDto,
  FindOneUserUrlWithUserDto,
  FindOneUserWithUrlDto,
  UpdateUserUrlDto,
} from '@interface';
import { UserUrlEntity } from '../entity/user-url.entity';

@Injectable()
export class UserUrlRepository implements IUserUrlRepository {
  constructor(
    private manager: EntityManager,
    @InjectRepository(UserUrlEntity)
    private userUrlRepository: Repository<UserUrlEntity>,
    private userUrlFactory: UserUrlFactory,
    private userFactory: UserFactory,
  ) {}

  async save(dto: CreateUserUrlDto) {
    return await this.manager.transaction(async (manager) => {
      const userUrlEntity = UserUrlMapper.toEntity(dto.url);
      const result = await manager.save(userUrlEntity);

      return this.userUrlFactory.reconstitute({
        id: result.id,
        url: result.url,
        status: result.status,
      });
    });
  }

  async update(dto: UpdateUserUrlDto) {
    return await this.manager.transaction(async (manager) => {
      const result = await manager.update(UserUrlEntity, dto.urlId, {
        status: false,
      });

      if (!result.affected) {
        throw new Error('url 상태 변경 실패');
      }
    });
  }

  async findOne(dto: FindOneUserUrlDto) {
    const userUrl = await this.userUrlRepository.findOne({
      where: {
        id: dto.urlId,
      },
    });

    if (!userUrl) return null;

    return this.userUrlFactory.reconstitute({
      id: userUrl.id,
      url: userUrl.url,
      status: userUrl.status,
    });
  }

  async findOneWithUrl(dto: FindOneUserWithUrlDto) {
    const userUrl = await this.userUrlRepository.findOne({
      where: {
        url: dto.url,
      },
    });

    if (!userUrl) return null;

    return true;
  }

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
}
