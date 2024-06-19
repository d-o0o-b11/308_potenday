import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceGameEntity } from '../entities/balance-game-list.entity';
import { UserUrlService } from '../../user-url/user-url.service';
import { UserBalanceGameEntity } from '../entities/user-balance-game.entity';
import { CreateBalanceGameDto } from '../dto/create-balance-game.dto';
import { FindBalanceGameDto } from '../dto/find-balance-game.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameKindMapper } from '../mapper/game-kind.mapper';
import { SaveUserBalance } from '../dto/save-balance-game.dto';

@Injectable()
export class BalanceGameService {
  constructor(
    @InjectRepository(UserBalanceGameEntity)
    private readonly userBalanceGameRepository: Repository<UserBalanceGameEntity>,

    @InjectRepository(BalanceGameEntity)
    private readonly balanceGameRepository: Repository<BalanceGameEntity>,

    private readonly userUrlService: UserUrlService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  //각 라운드 밸런스 게임 질문지 출력
  async getBalanceGame(balance_id: number) {
    const findOneResuelt = await this.balanceGameRepository.findOne({
      where: {
        id: balance_id,
      },
    });

    return findOneResuelt;
  }

  //밸런스 게임 투표
  async saveBalanceGame(dto: CreateBalanceGameDto) {
    const findResult = await this.userUrlService.findUrlId(dto.url);

    const saveBalanceGame = GameKindMapper.toBalanceGameEntity({
      url_id: findResult.id,
      user_id: dto.user_id,
      balance_id: dto.balance_id,
      balance_type: dto.type,
    } as unknown as SaveUserBalance);

    const saveResult = await this.userBalanceGameRepository.save(
      saveBalanceGame,
    );

    await this.findUserCountBalance(dto.url, dto.balance_id);

    return saveResult;
  }

  private async findUserCountBalance(url: string, balance_id: number) {
    const findResult = await this.userUrlService.findUserInfoWithBalance(url);

    const filteredData = findResult.map((entry) => ({
      ...entry,
      user: entry.user.filter((user) =>
        user.balance.some((balance) => balance.balance_id === balance_id),
      ),
    }));

    const countUser = await this.userUrlService.findUserInfo(url);

    if (filteredData[0].user.length == countUser.user.length) {
      await this.eventEmitter.emit('statusUpdated', { url: url, status: true });
    }
  }

  //각 밸런스 비율 출력
  async findBalanceGameUser(dto: FindBalanceGameDto) {
    const findResult = await this.userUrlService.findUserInfoWithBalance(
      dto.url,
    );

    const filteredData = findResult.map((entry) => ({
      ...entry,
      user: entry.user.filter((user) =>
        user.balance.some((balance) => balance.balance_id === dto.balance_id),
      ),
    }));

    const processedData: {
      url_id: number;
      img_id: number;
      nickname: string;
      balance_type: string;
    }[] = [];

    // rawData에서 필요한 정보 추출하여 processedData에 저장
    filteredData.forEach((item) => {
      item.user.forEach((user) => {
        const processedItem = {
          url_id: user.url_id,
          img_id: user.img_id,
          nickname: user.nickname,
          balance_type:
            user.balance.length > 0
              ? user.balance[dto.balance_id - 1].balance_type
              : '',
        };
        processedData.push(processedItem);
      });
    });

    const userPercentages = await this.calculateUserPercentages(
      processedData,
      dto.balance_id,
    );

    return {
      user: processedData,
      percent: userPercentages,
    };
  }

  private async calculateUserPercentages(data, balance_id) {
    const userCountByBalanceType = {};
    data.forEach((item) => {
      const balanceType = item.balance_type;
      if (userCountByBalanceType[balanceType] === undefined) {
        userCountByBalanceType[balanceType] = 1;
      } else {
        userCountByBalanceType[balanceType]++;
      }
    });

    const totalUsers = data.length;
    const percentages = [];

    for (const balanceType of Object.keys(userCountByBalanceType)) {
      const userCount = userCountByBalanceType[balanceType] || 0;
      const percentage = (userCount / totalUsers) * 100;
      const formattedPercentage = Math.round(percentage);
      const formattedResult = `${balanceType}: ${formattedPercentage}%`;
      percentages.push(formattedResult);

      if (formattedPercentage === 100) {
        const balance_type = await this.getBalanceGame(balance_id);
        if (balance_type) {
          if (balance_type.type_A == balanceType) {
            percentages.push(`${balance_type.type_B}: 0%`);
          } else {
            percentages.push(`${balance_type.type_A}: 0%`);
          }
        }
      }
    }

    const balance_type = await this.getBalanceGame(balance_id);
    if (balance_type) {
      const typeA = balance_type.type_A;
      const typeB = balance_type.type_B;
      const sortedPercentages = percentages.sort((a, b) => {
        if (a.includes(typeA) && b.includes(typeB)) {
          return -1;
        } else if (a.includes(typeB) && b.includes(typeA)) {
          return 1;
        }
        return 0;
      });
      return sortedPercentages;
    }

    return percentages;
  }
}
