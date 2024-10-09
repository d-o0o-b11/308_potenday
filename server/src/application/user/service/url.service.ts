import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AlreadyClickButtonUrlException, NotFoundUrlException } from '@common';
import { IUrlService } from '@interface';
import {
  URL_READ_REPOSITORY_TOKEN,
  URL_REPOSITORY_TOKEN,
  USER_READ_REPOSITORY_TOKEN,
} from '@infrastructure';
import {
  IUrlReadRepository,
  IUrlRepository,
  IUserReadRepository,
} from '@domain';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  CreateUserUrlDto,
  FindOneByUrlIdDto,
  FindOneUserUrlDto,
  FindOneUserWithUrlDto,
  UpdateUserUrlDto,
} from '../dto';

@Injectable()
export class UrlService implements IUrlService {
  constructor(
    @Inject(URL_REPOSITORY_TOKEN)
    private readonly urlRepository: IUrlRepository,
    @Inject(URL_READ_REPOSITORY_TOKEN)
    private readonly urlReadRepository: IUrlReadRepository,
    @Inject(USER_READ_REPOSITORY_TOKEN)
    private readonly userReadRepository: IUserReadRepository,

    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  async setUrl() {
    let url: string;

    while (true) {
      url = this._generateRandomUrl();
      if (!(await this._isUrlDuplicate(url, this.readManager))) {
        break;
      }
    }

    const save = await this.urlRepository.save(
      new CreateUserUrlDto(url),
      this.manager,
    );

    return save;
  }

  async checkUserLimitForUrl(dto: FindOneUserUrlDto) {
    const findOneResult = await this.urlReadRepository.findOneById(
      new FindOneByUrlIdDto(dto.urlId),
      this.readManager,
    );

    if (!findOneResult) {
      throw new NotFoundUrlException();
    }

    if (!findOneResult.getUserIdList()) {
      return { userCount: 0, userInfo: [], status: findOneResult.getStatus() };
    }

    const userList = await this.countUsersInRoom(
      //@memo slice -> readonly 속성을 제거..다른 방법 생각하기 -> 여기서만 getUserIdList를 사용해서 readonly 제거하는 방안으로 갔다.
      //slice 메서드를 사용하면, 배열을 복사하여 읽기 전용 속성을 제거 가능
      findOneResult.getUserIdList(),
      this.readManager,
    );

    return {
      userCount: userList.userCount,
      userInfo: userList.userInfo,
      status: findOneResult.getStatus(),
    };
  }

  async countUsersInRoom(userIdList: number[], manager: EntityManager) {
    const userList = await this.userReadRepository.findList(
      userIdList,
      manager,
    );

    const userCount = userList.length;

    return { userCount, userInfo: userList };
  }

  async updateStatusFalse(urlId: number) {
    const findOneResult = await this.urlReadRepository.findOneById(
      new FindOneByUrlIdDto(urlId),
      this.readManager,
    );

    if (!findOneResult) {
      throw new NotFoundUrlException();
    }

    if (!findOneResult.getStatus()) {
      throw new AlreadyClickButtonUrlException();
    }

    return await this.manager.transaction(async (manager) => {
      await this.urlRepository.update(
        findOneResult.getUrlId(),
        new UpdateUserUrlDto(false),
        manager,
      );
    });
  }

  async getUserInfoInUrl(urlId: number) {
    const findOneResult = await this.urlReadRepository.findOneById(
      new FindOneByUrlIdDto(urlId),
      this.readManager,
    );

    return await this.userReadRepository.findList(
      findOneResult.getUserIdList(),
      this.readManager,
    );
  }

  /**
   * 랜덤 URL 생성
   */
  private _generateRandomUrl(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  /**
   * URL 중복 검사
   */
  private async _isUrlDuplicate(
    url: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const findOneResult = await this.urlReadRepository.findOneByUrl(
      new FindOneUserWithUrlDto(url),
      manager,
    );
    return !!findOneResult;
  }
}
