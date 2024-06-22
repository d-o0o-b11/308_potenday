import { Inject, Injectable } from '@nestjs/common';
import { IUserUrlRepository } from '../../domain';
import * as crypto from 'crypto';
import { FindOneUserUrlDto, IUserUrlService } from '../../interface';
import {
  UrlAlreadyClickButtonException,
  UrlMaximumUserAlreadyClickButtonException,
  UrlNotFoundException,
} from '@common';
import { USER_URL_REPOSITORY_TOKEN } from '../../infrastructure';

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

    await this.urlRepository.save({ url });
    return url;
  }

  async checkUserLimitForUrl(dto: FindOneUserUrlDto) {
    const findOneResult = await this.urlRepository.findOne({ url: dto.url });

    if (!findOneResult) {
      throw new UrlNotFoundException();
    }

    if ((await this.countUsersInRoom(dto.url)).userCount >= 4) {
      throw new UrlMaximumUserAlreadyClickButtonException();
    }

    return findOneResult.getId();
  }

  async countUsersInRoom(url: string) {
    const userUrl = await this.urlRepository.findOneWithUser({
      url,
    });

    if (!userUrl.getUserList()) {
      return { userCount: 0, userInfo: [] };
    }

    const userCount = userUrl.getUserList().length;
    //@memo slice -> readonly 속성을 제거하여 userInfo 배열을 반환할 수 있도록 수정
    return { userCount, userInfo: userUrl.getUserList().slice() };
  }

  async updateStatusFalse(url: string) {
    const findOneResult = await this.urlRepository.findOne({
      url,
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
    const findOneResult = await this.urlRepository.findOne({ url });
    return !!findOneResult;
  }
}
