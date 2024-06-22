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
import {
  CalculatePercentagesResponseDto,
  FindUserBalanceDto,
  FindUserBalanceResponseDto,
  GroupedByBalanceTypeDto,
  SaveUserBalanceDto,
} from '../../../interface';

@Injectable()
export class UserBalanceRepository implements IUserBalanceRepository {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepository: Repository<UserBalanceEntity>,
    private readonly userBalanceFactory: UserBalanceFactory,
    private manager: EntityManager,
  ) {}

  async save(dto: SaveUserBalanceDto) {
    return await this.manager.transaction(async (manager) => {
      const entity = UserBalanceMapper.toEntity(
        dto.userId,
        dto.balanceId,
        dto.balanceType,
      );
      manager.save(UserBalanceEntity, entity);
    });
  }

  async findUserCount(dto: FindUserBalanceDto) {
    const findResult = await this.userBalanceRepository.find({
      where: {
        user: {
          urlId: dto.urlId,
        },
        balanceId: dto.balanceId,
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          // nickName: true,
          // imgId: true,
        },
        // id: true,
        // balanceType: true,
        // balanceId: true,
      },
    });

    // const userBalnces = findResult.map((balance) =>
    //   this.userBalanceFactory.reconstituteArray(
    //     balance.id,
    //     balance.user.id,
    //     balance.user.nickName,
    //     balance.user.imgId,
    //     balance.balanceId,
    //     balance.balanceType,
    //   ),
    // );

    return { count: findResult.length };
  }

  async find(dto: FindUserBalanceDto) {
    const findResult = await this.userBalanceRepository.find({
      where: {
        user: {
          urlId: dto.urlId,
        },
        balanceId: dto.balanceId,
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

    return this._calculatePercentages({
      groupedByBalanceType,
      totalUsers: userBalances.length,
    });
  }

  private _groupByBalanceType(
    userBalances: UserBalance[],
  ): GroupedByBalanceTypeDto {
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
    dto: FindUserBalanceResponseDto,
  ): CalculatePercentagesResponseDto[] {
    return Object.values(dto.groupedByBalanceType).map((group: any) => ({
      balanceType: group.balanceType,
      users: group.users,
      percent: `${((group.count / dto.totalUsers) * 100).toFixed(2)}%`,
    }));
  }
}
