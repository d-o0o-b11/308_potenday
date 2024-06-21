import { Injectable } from '@nestjs/common';
import { UserBalanceEntity } from '../entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IUserBalanceRepository,
  UserBalance,
  UserBalanceFactory,
} from '../../../domain';
import { UserBalanceMapper } from '../mapper';

@Injectable()
export class UserBalanceRepository implements IUserBalanceRepository {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepository: Repository<UserBalanceEntity>,
    private readonly userBalanceFactory: UserBalanceFactory,
    private manager: EntityManager,
  ) {}

  async save(userId: number, balanceId: number, balanceType: string) {
    return await this.manager.transaction(async (manager) => {
      const entity = UserBalanceMapper.toEntity(userId, balanceId, balanceType);
      manager.save(UserBalanceEntity, entity);
    });
  }

  async find(urlId: number) {
    const findResult = await this.userBalanceRepository.find({
      where: {
        user: {
          urlId: urlId,
        },
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          nickName: true,
          imgId: true,
        },
        id: true,
        balanceType: true,
        balanceId: true,
      },
    });

    const userBalnces = findResult.map((balance) =>
      this.userBalanceFactory.reconstituteArray(
        balance.id,
        balance.user.id,
        balance.user.nickName,
        balance.user.imgId,
        balance.balanceId,
        balance.balanceType,
      ),
    );

    return userBalnces;
  }

  async findUserBalance(urlId: number, balanceId: number) {
    const findResult = await this.userBalanceRepository.find({
      where: {
        user: {
          urlId: urlId,
        },
        balanceId: balanceId,
      },
      relations: {
        user: true,
        balanceGame: true,
      },
      select: {
        user: {
          id: true,
          nickName: true,
          imgId: true,
        },
        balanceType: true,
        balanceId: true,
        balanceGame: {
          typeA: true,
          typeB: true,
        },
      },
    });

    const userBalances = findResult.map((balance) =>
      this.userBalanceFactory.reconstituteArray(
        balance.id,
        balance.user.id,
        balance.user.nickName,
        balance.user.imgId,
        balance.balanceId,
        balance.balanceType,
        {
          typeA: balance.balanceGame.typeA,
          typeB: balance.balanceGame.typeB,
        },
      ),
    );

    const groupedByBalanceType = this._groupByBalanceType(userBalances);

    return this._calculatePercentages(
      groupedByBalanceType,
      userBalances.length,
    );
  }

  private _groupByBalanceType(userBalances: UserBalance[]): {
    [key: string]: {
      balanceType: string;
      users: { id: number; nickName: string; imgId: number }[];
      count: number;
    };
  } {
    return userBalances.reduce((acc, balance) => {
      const balanceTypeText =
        balance.getBalanceType() === 'A'
          ? balance.getBalanceGame().typeA
          : balance.getBalanceGame().typeB;

      if (!acc[balanceTypeText]) {
        acc[balanceTypeText] = {
          balanceType: balanceTypeText,
          users: [],
          count: 0,
        };
      }

      acc[balanceTypeText].users.push({
        id: balance.getUserId(),
        nickName: balance.getNickName(),
        imgId: balance.getImgId(),
      });

      acc[balanceTypeText].count++;
      return acc;
    }, {});
  }

  private _calculatePercentages(
    groupedByBalanceType: {
      [key: string]: {
        balanceType: string;
        users: {
          id: number;
          nickName: string;
          imgId: number;
        }[];
        count: number;
      };
    },
    totalUsers: number,
  ): {
    balanceType: string;
    users: { id: number; nickName: string; imgId: number }[];
    percent: string;
  }[] {
    return Object.values(groupedByBalanceType).map((group: any) => ({
      balanceType: group.balanceType,
      users: group.users,
      percent: `${((group.count / totalUsers) * 100).toFixed(2)}%`,
    }));
  }
}
