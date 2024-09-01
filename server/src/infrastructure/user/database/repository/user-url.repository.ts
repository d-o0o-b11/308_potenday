import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserUrlMapper } from '../mapper';
import { IUrlRepository, UrlFactory } from '@domain';
import { UserUrlEntity } from '../entity/cud/user-url.entity';
import { DeleteUrlException, UpdateUrlException } from '@common';
import {
  CreateUserUrlDto,
  ReconstituteFactoryDto,
  UpdateUserUrlDto,
} from '@application';

@Injectable()
export class UserUrlRepository implements IUrlRepository {
  constructor(private readonly urlFactory: UrlFactory) {}

  async save(dto: CreateUserUrlDto, manager: EntityManager) {
    const userUrlEntity = UserUrlMapper.toEntity(dto.url);
    const result = await manager.save(userUrlEntity);

    return this.urlFactory.reconstitute(
      new ReconstituteFactoryDto(
        result.id,
        result.url,
        result.status,
        result.createdAt,
        result.updatedAt,
        result.deletedAt,
      ),
    );
  }

  async update(urlId: number, dto: UpdateUserUrlDto, manager: EntityManager) {
    const result = await manager.update(UserUrlEntity, urlId, {
      status: dto.status,
    });

    if (!result.affected) {
      throw new UpdateUrlException();
    }

    return result;
  }

  async delete(id: number, manager: EntityManager) {
    const result = await manager.delete(UserUrlEntity, id);

    if (!result.affected) {
      throw new DeleteUrlException();
    }

    return result;
  }
}
