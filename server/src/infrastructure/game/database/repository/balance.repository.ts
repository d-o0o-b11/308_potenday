import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IBalanceRepository, UserBalance, BalanceFactory } from '@domain';
import { UserBalanceMapper } from '../mapper';
import {
  CalculatePercentagesResponseDto,
  DeleteUserBalanceDto,
  FindSubmitUserDto,
  FindUserBalanceDto,
  FindUserBalanceResponseDto,
  GroupedByBalanceTypeDto,
  SaveUserBalanceDto,
} from '@interface';
import { UserBalanceEntity } from '../entity/cud/user-balance.entity';

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly userBalanceRepository: Repository<UserBalanceEntity>,
    private readonly balanceFactory: BalanceFactory,
    private manager: EntityManager,
  ) {}

  async create(dto: SaveUserBalanceDto) {
    return await this.manager.transaction(async (manager) => {
      const result = await manager.save(
        UserBalanceEntity,
        UserBalanceMapper.toEntity(dto.userId, dto.balanceId, dto.balanceType),
      );

      return this.balanceFactory.reconstitute(
        result.id,
        result.userId,
        result.balanceId,
        result.balanceType,
        result.createdAt,
      );
    });
  }

  async delete(dto: DeleteUserBalanceDto, manager: EntityManager) {
    const { userId, balanceId } = dto;

    const result = await manager.softDelete(UserBalanceEntity, {
      userId,
      balanceId,
    });

    if (!result.affected) {
      throw new Error('형용사 표현 삭제 과정에서 오류 발생');
    }

    return result;
  }

  async isSubmitUser(dto: FindSubmitUserDto) {
    const findResult = await this.userBalanceRepository.findOne({
      where: {
        userId: dto.userId,
        balanceId: dto.balanceId,
      },
    });

    return findResult ? true : false;
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
        },
      },
    });

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
      this.balanceFactory.reconstituteArray(
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
      percent: `${Math.floor((group.count / dto.totalUsers) * 100)}%`,
    }));
  }
}
