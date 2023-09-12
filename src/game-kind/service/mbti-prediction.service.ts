import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserUrlService } from 'src/user-url/user-url.service';
import { FindMbtiRoundDto } from '../dto/find-mbti-round.dto';
import { SaveMbtiRoundDto } from '../dto/save-mbti-round.dto';
import { MbtiChooseEntity } from '../entities/mbti-choose.entity';
import { AdjectiveExpressionService } from './adjective-expression.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameKindMapper } from '../mapper/game-kind.mapper';
import { SaveMbtiDto } from '../dto/save-mbti.dto';

@Injectable()
export class MbtiPredictionService {
  constructor(
    @InjectRepository(MbtiChooseEntity)
    private readonly mbtiChooseEntityRepository: Repository<MbtiChooseEntity>,

    private readonly userUrlService: UserUrlService,

    private readonly adjectiveExpressionService: AdjectiveExpressionService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  //해당 라운드때 어떤 유저의 mbti 맞추는 차례인지
  async getMbtiRound(dto: FindMbtiRoundDto) {
    const findResult = await this.userUrlService.findUserInfo(dto.url);

    return {
      user_id: findResult.user[dto.round_id - 1].id,
      img_id: findResult.user[dto.round_id - 1].img_id,
      nickname: findResult.user[dto.round_id - 1].nickname,
    };
  }

  //해당 라운드 mbti 맞추기 또는 본인 mbti 저장
  async saveUserMbti(dto: SaveMbtiRoundDto) {
    const findResult = await this.userUrlService.findUrlId(dto.url);

    if (dto.user_id == dto.to_user_id) {
      await this.userUrlService.saveUserMbti(dto.user_id, dto.mbti);
    } else {
      //다른 사람 추측
      const saveUserMbti = GameKindMapper.toUserMbtiEntity({
        url_id: findResult.id,
        user_id: dto.user_id,
        mbti: dto.mbti,
        to_user_id: dto.to_user_id,
      } as SaveMbtiDto);

      await this.mbtiChooseEntityRepository.save(saveUserMbti);
    }

    const findUrlUser = await this.userUrlService.findUserInfo(dto.url);
    const count_check = await this.checkMbtiUserCount(dto.url, dto.round_id);

    if (findUrlUser.user.length == count_check) {
      this.eventEmitter.emit('statusUpdated', { url: dto.url, status: true });
    }

    return true;
  }

  private async checkMbtiUserCount(url: string, round_id: number) {
    let cnt = 0;
    const findResult = await this.userUrlService.findUserInfo(url);

    const findUserInfo = await this.userUrlService.findOneUserInfo(
      findResult.user[round_id - 1].id,
    );

    const findOtherResult = await this.mbtiChooseEntityRepository.find({
      where: {
        url_id: findResult.id,
        to_user_id: findResult.user[round_id - 1].id,
      },
    });

    if (findUserInfo.mbti) cnt++;

    for (let i = 0; i < findOtherResult.length; i++) {
      await this.userUrlService.findOneUserInfo(findOtherResult[i].user_id);

      if (findOtherResult[i].mbti) cnt++;
    }
    return cnt;
  }

  //결과 출력
  async getResultMbtiRound(dto: FindMbtiRoundDto) {
    const findResult = await this.userUrlService.findUserInfo(dto.url);

    const findUserInfo = await this.userUrlService.findOneUserInfo(
      findResult.user[dto.round_id - 1].id,
    );

    const findOtherResult = await this.mbtiChooseEntityRepository.find({
      where: {
        url_id: findResult.id,
        to_user_id: findResult.user[dto.round_id - 1].id,
      },
      order: {
        created_at: 'ASC',
      },
    });

    const other_user_choose = [];
    for (let i = 0; i < findOtherResult.length; i++) {
      const user_info = await this.userUrlService.findOneUserInfo(
        findOtherResult[i].user_id,
      );

      other_user_choose.push({
        img_id: user_info.img_id,
        nickname: user_info.nickname,
        choose_mbti: findOtherResult[i].mbti,
      });
    }

    return { user_mbti: findUserInfo.mbti, user: other_user_choose };
  }

  //모든 게임 결과 출력
  async finalAllUserData(url: string) {
    const adjective =
      await this.adjectiveExpressionService.findUserAdjectiveExpressioList(
        url,
        true,
      );

    const findUserInfo = await this.userUrlService.findUserToUrlOrder(url);

    const result = [];

    for (let i = 0; i < adjective.length; i++) {
      result.push({
        img_id: adjective[i].img_id,
        nickname: adjective[i].nickname,
        expressions: adjective[i].expressions,
        mbti: findUserInfo.user[i].mbti,
      });
    }

    return result;
  }
}
