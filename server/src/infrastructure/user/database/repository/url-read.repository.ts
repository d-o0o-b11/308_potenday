import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { IUrlReadRepository, UrlFactory } from '@domain';
// import { UrlReadEntity } from '../entity/read/url-read.entity';
import { UserUrlMapper } from '../mapper';
import {
  CreateUserUrlReadDto,
  DeleteUserIdDto,
  FindOneByUrlIdDto,
  FindOneUserWithUrlDto,
  ReconstituteFindFactoryDto,
  UpdateUserIdDto,
  UpdateUserUrlStatusDto,
} from '@application';
import {
  DeleteUrlException,
  DeleteUrlUserIdException,
  UpdateUrlException,
  UpdateUrlUserIdListException,
} from '@common';
import { UrlReadEntity } from '../entity';

@Injectable()
export class UrlReadRepository implements IUrlReadRepository {
  constructor(private readonly urlFactory: UrlFactory) {}

  async create(dto: CreateUserUrlReadDto, manager: EntityManager) {
    const urlRead = this.urlFactory.reconstituteRead(
      new CreateUserUrlReadDto(
        dto.urlId,
        dto.url,
        dto.status,
        dto.createdAt,
        dto.updatedAt,
        dto.deletedAt,
      ),
    );
    const urlReadEntity = UserUrlMapper.toEntityRead(urlRead);

    await manager.save(urlReadEntity);
  }

  async updateStatus(dto: UpdateUserUrlStatusDto, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder()
      .update(UrlReadEntity)
      .set({
        data: () =>
          `jsonb_set(data, '{status}', '${dto.status}'::jsonb, false)`,
      })
      .where("data->>'urlId' = :urlId", { urlId: dto.urlId })
      .execute();

    if (!result.affected) {
      throw new UpdateUrlException();
    }

    return result;
  }

  async updateUserList(dto: UpdateUserIdDto, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder()
      .update(UrlReadEntity)
      .set({
        data: () =>
          `jsonb_set(data, '{userIdList}', (CASE WHEN data->'userIdList' IS NULL THEN '[]' ELSE data->'userIdList' END) || '[${dto.userId}]', true)`,
      })
      .where("data->>'urlId' = :urlId", { urlId: dto.urlId })
      .execute();

    if (!result.affected) {
      throw new UpdateUrlUserIdListException();
    }

    return result;
  }

  /**
   * @memo
   * findOneWithUser랑 합쳤다
   * 이유 : 기존 findOneWithUser로직은 user join 쳐서 user 정보를 반환하는건데 read DB에선 join이 없다.
   * 그래서, 여기서 반환하는 userIdList를 이용해서 user read repository에 조회 후 사용해야한다.
   */
  async findOneById(dto: FindOneByUrlIdDto, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder()
      .select('url.data', 'data')
      .from(UrlReadEntity, 'url')
      .where("url.data->>'urlId' = :urlId", { urlId: dto.urlId })
      .getRawOne();

    if (!result) return null;

    return this.urlFactory.reconstituteFind(
      new ReconstituteFindFactoryDto(
        result.data.urlId,
        result.data.url,
        result.data.status,
        result.data.userIdList,
      ),
    );
  }

  async findOneByUrl(dto: FindOneUserWithUrlDto, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder()
      .select('url.id', 'id')
      .from(UrlReadEntity, 'url')
      .where("url.data->>'url' = :url", { url: dto.url })
      .getRawOne();

    return !!result;
  }

  async delete(urlId: number, manager: EntityManager) {
    const result = await manager
      .createQueryBuilder()
      .delete()
      .from(UrlReadEntity, 'url')
      .where("url.data->>'urlId' = :urlId", { urlId })
      .execute(); // execute를 사용해 실제 삭제 작업 실행

    if (!result.affected) {
      throw new DeleteUrlException();
    }

    return result;
  }

  async deleteUserId(
    urlId: number,
    dto: DeleteUserIdDto,
    manager: EntityManager,
  ) {
    const result = await manager
      .createQueryBuilder()
      .update(UrlReadEntity)
      .set({
        data: () => `
          jsonb_set(
            data,
            '{userIdList}',
            (data->'userIdList') - '${dto.userId}',
            true
          )
        `,
      })
      .where("data->>'urlId' = :urlId", { urlId })
      .execute();

    if (!result.affected) {
      throw new DeleteUrlUserIdException();
    }

    return result;
  }
}
