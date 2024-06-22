import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserUrlEntity } from '../entity';
import { UserUrlMapper } from '../mapper';
import {
  IUserUrlRepository,
  UserFactory,
  UserUrlFactory,
} from '../../../domain';
import {
  CreateUserUrlDto,
  FindOneUserUrlDto,
  FindOneUserUrlWithUserDto,
  UpdateUserUrlDto,
} from '../../../interface';

@Injectable()
export class UserUrlRepository implements IUserUrlRepository {
  constructor(
    private manager: EntityManager,
    @InjectRepository(UserUrlEntity)
    private userUrlRepository: Repository<UserUrlEntity>,
    private userUrlFactory: UserUrlFactory,
    private userFactory: UserFactory,
  ) {}

  //반환값 다시 확인
  async save(dto: CreateUserUrlDto) {
    return await this.manager.transaction(async (manager) => {
      const userUrlEntity = UserUrlMapper.toEntity(dto.url);
      const result = await manager.save(userUrlEntity);

      return {
        id: result.id,
      };
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
        url: dto.url,
      },
    });

    if (!userUrl) return null;

    return this.userUrlFactory.reconstitute({
      id: userUrl.id,
      url: userUrl.url,
      status: userUrl.status,
    });
  }

  async findOneWithUser(dto: FindOneUserUrlWithUserDto) {
    const result = await this.userUrlRepository.findOne({
      where: {
        url: dto.url,
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
