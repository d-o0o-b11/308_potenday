import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserUrlEntity } from './entities/user-url.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CreateUserUrlDto } from './dto/create-user-url.dto';
import { UserInfoEntity } from './entities/user-info.entity';

@Injectable()
export class UserUrlService {
  constructor(
    @InjectRepository(UserUrlEntity)
    private readonly userUrlRepository: Repository<UserUrlEntity>,

    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
  ) {}

  //url 중복확인
  async findDuplication(url: string) {
    const findOneResuelt = await this.userUrlRepository.findOne({
      where: {
        url: url,
      },
    });

    if (findOneResuelt) {
      return true;
    }

    return false;
  }

  //랜덤 url 출력하기
  async setUrl() {
    let url;
    let isDuplicate;

    do {
      url = crypto.randomBytes(20).toString('hex');
      isDuplicate = await this.findDuplication(url);
    } while (isDuplicate); // 중복이면 다시 랜덤 url발급하고 찾기

    //중복아닌 url 저장하고 발급하기
    await this.userUrlRepository.save({
      url: url,
    });

    return url;
  }

  //유저 닉네임 해당 링크에 저장하기
  async saveUserProfileToUrl(dto: CreateUserUrlDto) {
    const findOneResult = await this.userUrlRepository.findOne({
      where: {
        url: dto.url,
      },
    });

    if (!findOneResult) {
      throw new NotFoundException('존재하지 않는 url입니다.');
    }

    const saveResult = await this.userInfoRepository.save({
      url_id: findOneResult?.id,
      img_id: dto.img_id,
      nickname: dto.nickname,
    });

    return {
      user_id: saveResult.id,
      img_id: saveResult.img_id,
      nickname: saveResult.nickname,
      url: saveResult.url,
    };
  }

  //대기방 인원 수
  async countUserToWaitingRoom(url: string) {
    const userUrl = await this.userUrlRepository
      .createQueryBuilder('user_url')
      .where('user_url.url = :url', { url })
      .getOne();

    if (!userUrl) {
      return { userCount: 0, userInfo: [] };
    }

    const userInfo = await this.userInfoRepository
      .createQueryBuilder('user_info')
      .select([
        'user_info.id',
        'user_info.url_id',
        'user_info.img_id',
        'user_info.nickname',
      ])
      .where('user_info.url_id = :urlId', { urlId: userUrl.id })
      .orderBy('user_info.created_at', 'ASC') // Sort by created_at in ascending order
      .getMany();

    const userCount = userInfo.length;

    return { userCount, userInfo };
  }

  //입장 마감
  async updateStatusFalse(url: string) {
    const findOneResult = await this.userUrlRepository.findOne({
      where: {
        url: url,
      },
    });

    if (!findOneResult) {
      throw new NotFoundException('존재하지 않는 url입니다.');
    }

    const updateResult = await this.userUrlRepository.update(findOneResult.id, {
      status: false,
    });

    if (!updateResult.affected) {
      throw new Error('url 상태 변경 실패');
    }

    return true;
  }

  //url 이용해서 형용사 표현 출력
  async findUserAdjectiveExpressioList(url: string) {
    const findResult = await this.userUrlRepository.findOne({
      where: {
        url: url,
      },
      relations: {
        user: {
          expressions: {
            expressions: true,
          },
        },
      },
    });

    return findResult;
  }

  //형용사 표현 몇명이 완료했는지 인원 수 체크
  async countUserAdjectiveExpression(url: string) {
    const findResult = await this.findUserAdjectiveExpressioList(url);

    let user_count = 0;
    for (let i = 0; i < findResult.user.length; i++) {
      if (findResult.user[i].expressions.length > 0) {
        user_count++;
      }
    }

    return user_count;
  }

  //url 상태! (게임 시작한 상태인지 대기중인지 확인)
  async getUrlStatus(url: string) {
    const findOneResuelt = await this.userUrlRepository.findOne({
      where: {
        url: url,
      },
    });

    return findOneResuelt?.status;
  }

  async updateOnBoardingUser(user_id: number) {
    const updateResult = await this.userInfoRepository.update(user_id, {
      onboarding: true,
    });

    if (!updateResult.affected)
      throw new Error('onboarding 상태 업데이트 실패');

    return true;
  }

  //모두가 onboarding 했는지 확인
  async findOnBoardingUserCheck(url: string) {
    const findResult = await this.userUrlRepository.findOne({
      where: {
        url: url,
      },
      relations: {
        user: true,
      },
    });
    const trueOnboardingCount = findResult.user.filter(
      (user) => user.onboarding === true,
    ).length;

    if (trueOnboardingCount !== findResult.user.length) {
      return false;
    }

    return true;
  }

  //url로 url id 찾아서 return
  async findUrlId(url: string) {
    const findOneResult = await this.userUrlRepository.findOne({
      where: {
        url: url,
      },
    });

    if (!findOneResult) {
      throw new NotFoundException('존재하지 않는 url 입니다.');
    }

    return findOneResult;
  }
}
