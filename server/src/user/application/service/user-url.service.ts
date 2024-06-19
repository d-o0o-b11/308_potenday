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

  //방 url 발급
  async setUrl() {
    let url: string;

    while (true) {
      url = this.generateRandomUrl();
      if (!(await this.isUrlDuplicate(url))) {
        break;
      }
    }

    await this.urlRepository.save({ url });
    return url;
  }

  //해당 url 인원수 확인
  //4명 초과시 에러
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

  //대기방 인원 수 확인
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

  //최대인원 4명 초과 시 입장 마감 status:false
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

  private generateRandomUrl(): string {
    return crypto.randomBytes(4).toString('hex');
  }

  private async isUrlDuplicate(url: string): Promise<boolean> {
    const findOneResult = await this.urlRepository.findOne({ url });
    return !!findOneResult;
  }
}
