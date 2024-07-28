import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Raw, Repository } from 'typeorm';
import { UserFactory, UserUrlFactory } from '@domain';
import { FindOneUserUrlDto, FindOneUserWithUrlDto } from '@interface';
import { UrlReadEntity } from '../entity/read/url-read.entity';

@Injectable()
export class UserUrlRepository {
  constructor(
    private manager: EntityManager,
    @InjectRepository(UrlReadEntity, 'read')
    private urlRepository: Repository<UrlReadEntity>,
    private userUrlFactory: UserUrlFactory,
    private userFactory: UserFactory,
  ) {}

  async findOne(dto: FindOneUserUrlDto) {
    const urlFindResult = await this.urlRepository.findOne({
      where: {
        data: Raw((alias) => `${alias} @> '{"urlId": ${dto.urlId}}'`),
      },
    });

    if (!urlFindResult) return null;

    return this.userUrlFactory.reconstitute({
      id: urlFindResult.data.getUrlId(),
      url: urlFindResult.data.getUrl(),
      status: urlFindResult.data.getStatus(),
    });
  }

  async findOneWithUrl(dto: FindOneUserWithUrlDto) {
    const userUrl = await this.urlRepository.findOne({
      where: {
        data: Raw((alias) => `${alias} @> '{"url": ${dto.url}}'`),
      },
    });

    if (!userUrl) return null;

    return true;
  }

  /**
   * @memo
   * 해당 로직은 user read로 이동하는게 맞다고 판단 -> 수정하기
   */
  //   async findOneWithUser(dto: FindOneUserUrlWithUserDto) {
  //     const result = await this.urlRepository.findOneOrFail({
  //       where: {
  //         id: dto.urlId,
  //       },
  //       relations: {
  //         user: true,
  //       },
  //       order: {
  //         user: {
  //           createdAt: 'ASC',
  //         },
  //       },
  //     });

  //     const users = result.user.map((user) =>
  //       this.userFactory.reconstituteArray({
  //         id: user.id,
  //         imgId: user.imgId,
  //         nickName: user.nickName,
  //         urlId: user.urlId,
  //       }),
  //     );

  //     return this.userUrlFactory.reconstituteWithUser({
  //       id: result.id,
  //       url: result.url,
  //       status: result.status,
  //       users: users,
  //     });
  //   }
}
