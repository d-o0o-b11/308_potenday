import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  UrlAlreadyClickButtonException,
  UrlMaximumUserAlreadyClickButtonException,
  UrlNotFoundException,
  UrlStatusFalseException,
} from '@common';
import { FindOneUserUrlDto, IUserUrlService } from '@interface';
import { USER_URL_REPOSITORY_TOKEN } from '@infrastructure';
import { IUserUrlRepository } from '@domain';

@Injectable()
export class UserUrlService implements IUserUrlService {
  constructor(
    @Inject(USER_URL_REPOSITORY_TOKEN)
    private urlRepository: IUserUrlRepository,
  ) {}

  async setUrl() {
    let url: string;

    while (true) {
      url = this._generateRandomUrl();
      if (!(await this._isUrlDuplicate(url))) {
        break;
      }
    }

    const save = await this.urlRepository.save({ url });

    return {
      id: save.getId(),
      url: save.getUrl(),
    };
  }

  async checkUserLimitForUrl(dto: FindOneUserUrlDto) {
    const findOneResult = await this.urlRepository.findOne({
      urlId: dto.urlId,
    });

    if (!findOneResult) {
      throw new UrlNotFoundException();
    }

    if (!findOneResult.getStatus()) {
      throw new UrlStatusFalseException();
    }

    if ((await this.countUsersInRoom(dto.urlId)).userCount >= 4) {
      throw new UrlMaximumUserAlreadyClickButtonException();
    }

    return findOneResult.getId();
  }

  async countUsersInRoom(urlId: number) {
    const userUrl = await this.urlRepository.findOneWithUser({
      urlId,
    });

    if (!userUrl.getUserList()) {
      return { userCount: 0, userInfo: [] };
    }

    const userCount = userUrl.getUserList().length;
    //@memo slice -> readonly 속성을 제거하여 userInfo 배열을 반환할 수 있도록 수정
    return { userCount, userInfo: userUrl.getUserList().slice() };
  }

  async updateStatusFalse(urlId: number) {
    const findOneResult = await this.urlRepository.findOne({
      urlId,
    });

    if (!findOneResult) {
      throw new UrlNotFoundException();
    }

    if (!findOneResult.getStatus()) {
      throw new UrlAlreadyClickButtonException();
    }

    await this.urlRepository.update({
      urlId: findOneResult.getId(),
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
  private async _isUrlDuplicate(url: string): Promise<boolean> {
    const findOneResult = await this.urlRepository.findOneWithUrl({ url });
    return !!findOneResult;
  }
}
