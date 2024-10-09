import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  Balance,
  UserBalance,
  BalanceFactory,
  IBalanceReadRepository,
} from '@domain';
import {
  CalculatePercentagesResponseDto,
  FindUserBalanceDto,
  FindUserBalanceResponseDto,
  GroupedByBalanceTypeDto,
} from '@interface';
import {
  CreateBalanceReadDto,
  DeleteUserBalanceReadDto,
  FindSubmitUserDto,
  ReconstituteBalanceArrayDto,
} from '@application';
import {
  DeleteBalanceException,
  NotFoundBalanceException,
  NotFoundBalanceListException,
  UpdateBalanceException,
} from '@common';
import { BalanceListReadEntity } from '../entity';
import { UserReadEntity } from '@infrastructure';

@Injectable()
export class BalanceReadRepository implements IBalanceReadRepository {
  constructor(private readonly balanceFactory: BalanceFactory) {}

  async create(dto: CreateBalanceReadDto, manager: EntityManager) {
    const { userId, balanceId, balanceType, createdAt } = dto;

    const balance = {
      balanceId: balanceId,
      balanceType: balanceType,
      createdAt: createdAt,
    };

    const result = await manager
      .createQueryBuilder()
      .update(UserReadEntity)
      .set({
        data: () =>
          `jsonb_set(
          data, 
          '{balance}', 
          (CASE 
            WHEN data->'balance' IS NULL 
            THEN '[]' 
            ELSE data->'balance' 
          END) || '${JSON.stringify(balance)}'::jsonb, 
          true
        )`,
      })
      .where("data->>'userId' = :userId", { userId })
      .execute();

    if (!result.affected) {
      throw new UpdateBalanceException();
    }
  }

  async isSubmitUser(dto: FindSubmitUserDto, manager: EntityManager) {
    const user = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select("data->'balance' AS balance") //["data->'balance' AS balance"]
      .where("data->>'userId' = :userId", { userId: dto.userId })
      .getRawOne();

    // balance가 존재하지 않으면 false 반환
    if (!user || !user.balance) {
      return false;
    }

    // balance 배열에서 balanceId가 일치하는 항목을 찾음
    const balanceList = user.balance as Balance[];
    const hasBalance = balanceList.some(
      (balance) => balance.balanceId === dto.balanceId,
    );

    // balanceId가 존재하면 true, 그렇지 않으면 false 반환
    return hasBalance;
  }

  async findUserCount(dto: FindUserBalanceDto, manager: EntityManager) {
    const usersWithMatchingBalance = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select('COUNT(*)', 'count') // 일치하는 유저의 수를 세기 위해 COUNT 사용
      .where("data->>'urlId' = :urlId", { urlId: dto.urlId }) // urlId에 해당하는 유저 조회
      .andWhere("data->'balance' IS NOT NULL") // balance 배열이 있는 유저만 조회
      .andWhere(
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'balance') AS balance
          WHERE balance->>'balanceId' = :balanceId
        )
      `,
        { balanceId: dto.balanceId },
      ) // balance 배열에 dto.balanceId가 존재하는지 확인
      .getRawOne(); // 조회 결과를 가져옴

    // usersWithMatchingBalance.count  이게 문자열인지 정수형인지 확인필요
    // return { count: parseInt(usersWithMatchingBalance.count, 10) };
    return { count: usersWithMatchingBalance.count };
  }

  async find(dto: FindUserBalanceDto, manager: EntityManager) {
    const usersWithMatchingBalance = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select([
        "data->>'userId' AS userId",
        "data->>'name' AS name",
        "data->>'imgId' AS imgId",
        "data->>'balance' AS balance",
      ])
      .where("data->>'urlId' = :urlId", { urlId: dto.urlId })
      .andWhere(
        `
        EXISTS (
          SELECT 1
          FROM jsonb_array_elements(data->'balance') AS balance
          WHERE balance->>'balanceId' = :balanceId
        )
      `,
        { balanceId: dto.balanceId },
      )
      .getRawMany();

    const balanceGame = await manager
      .createQueryBuilder(BalanceListReadEntity, 'balanceGame')
      .select(['balanceGame.typeA', 'balanceGame.typeB'])
      .where('balanceGame.id = :balanceId', { balanceId: dto.balanceId })
      .getOne();

    if (!balanceGame) {
      throw new NotFoundBalanceListException();
    }

    const userMatchBalance = usersWithMatchingBalance.map((user) => {
      const balanceArray = JSON.parse(user.balance);

      // balanceArray에서 dto.balanceId와 일치하는 객체만 필터링
      const filteredBalances = balanceArray.filter(
        (balance: any) => balance.balanceId == dto.balanceId,
      );

      return {
        userId: user.userid,
        name: user.name,
        imgId: user.imgid,
        balances: filteredBalances[0],
      };
    });

    const userBalances = usersWithMatchingBalance.map((balance, idx) =>
      this.balanceFactory.reconstituteArray(
        new ReconstituteBalanceArrayDto(
          dto.balanceId,
          Number(balance.userid),
          balance.name,
          Number(balance.imgid),
          userMatchBalance[idx].balances.balanceId,
          userMatchBalance[idx].balances.balanceType,
          {
            typeA: balanceGame.typeA,
            typeB: balanceGame.typeB,
          },
        ),
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
        name: balance.getName(),
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

  async delete(dto: DeleteUserBalanceReadDto, manager: EntityManager) {
    const { userId, balanceId } = dto;

    const user = await manager
      .createQueryBuilder(UserReadEntity, 'user')
      .select("user.data->'balance' AS balance")
      .where("user.data->>'userId' = :userId", { userId })
      .getRawOne();

    if (!user || !user.balance) {
      throw new NotFoundBalanceException();
    }

    const balances: Balance[] = JSON.parse(user.balance);

    const updatedBalances = balances.filter(
      (balance) => balance.balanceId !== balanceId,
    );

    const result = await manager
      .createQueryBuilder()
      .update(UserReadEntity)
      .set({
        data: () =>
          `jsonb_set(data, '{balance}', '${JSON.stringify(
            updatedBalances,
          )}'::jsonb, false)`,
      })
      .where("data->>'userId' = :userId", { userId })
      .execute();

    if (!result.affected) {
      throw new DeleteBalanceException();
    }

    return result;
  }
}
