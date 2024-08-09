import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  UrlAlreadyClickButtonException,
  UrlNotFoundException,
  UrlStatusFalseException,
} from '@common';
import {
  CreateUserUrlDto,
  FindOneByUrlIdDto,
  FindOneUserUrlDto,
  FindOneUserWithUrlDto,
  IUserUrlService,
  UpdateUserUrlDto,
} from '@interface';
import {
  UrlReadRepository,
  USER_URL_REPOSITORY_TOKEN,
  UserReadRepository,
} from '@infrastructure';
import { IUserUrlRepository } from '@domain';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class UserUrlService implements IUserUrlService {
  constructor(
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private urlRepository: IUserUrlRepository,
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
    private urlReadRepository: UrlReadRepository,
    private userReadRepository: UserReadRepository,
  ) {}

  async setUrl() {
    return await this.manager.transaction(async (manager) => {
      let url: string;

      while (true) {
        url = this._generateRandomUrl();
        if (!(await this._isUrlDuplicate(url, this.readManager))) {
          break;
        }
      }

      const save = await this.urlRepository.save(
        new CreateUserUrlDto(url),
        manager,
      );

      return save;
    });
  }

  async checkUserLimitForUrl(dto: FindOneUserUrlDto) {
    return await this.readManager.transaction(async (readManager) => {
      const findOneResult = await this.urlReadRepository.findOneById(
        new FindOneByUrlIdDto(dto.urlId),
        readManager,
      );

      if (!findOneResult) {
        throw new UrlNotFoundException();
      }

      if (!findOneResult.getStatus()) {
        throw new UrlStatusFalseException();
      }

      if (!findOneResult.getUserIdList()) {
        return { userCount: 0, userInfo: [] };
      }

      const userList = await this.countUsersInRoom(
        //@memo slice -> readonly 속성을 제거..다른 방법 생각하기
        //slice 메서드를 사용하면, 배열을 복사하여 읽기 전용 속성을 제거 가능
        findOneResult.getUserIdList().slice(),
        readManager,
      );

      return { userCount: userList.userCount, userInfo: userList.userInfo };
    });
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
      throw new UrlNotFoundException();
    }

    if (!findOneResult.getStatus()) {
      throw new UrlAlreadyClickButtonException();
    }

    return await this.manager.transaction(async (manager) => {
      await this.urlRepository.update(
        new UpdateUserUrlDto(findOneResult.getUrlId()),
        manager,
      );
    });
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
