import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAdjectiveExpressionEntity } from '../entity';
import { EntityManager, Repository } from 'typeorm';
import { UserAdjectiveExpressionMapper } from '../mapper';
import {
  IUserAdjectiveExpressionRepository,
  UserAdjectiveExpression,
  UserAdjectiveExpressionFactory,
} from '../../../domain';
import {
  FindUserAdjectiveExpressionDto,
  GroupByUserAdjectiveExpressionDto,
  SaveUserAdjectiveExpressionDto,
} from '../../../interface';

@Injectable()
export class UserAdjectiveExpressionRepository
  implements IUserAdjectiveExpressionRepository
{
  constructor(
    @InjectRepository(UserAdjectiveExpressionEntity)
    private userAdjectiveExpressionRepository: Repository<UserAdjectiveExpressionEntity>,
    private manager: EntityManager,
    private userAdjectiveExpressionFactory: UserAdjectiveExpressionFactory,
  ) {}

  async save(dto: SaveUserAdjectiveExpressionDto) {
    return await this.manager.transaction(async (manager) => {
      const entitiesToSave = UserAdjectiveExpressionMapper.toEntities(
        dto.userId,
        dto.expressionIds,
      );
      await manager.save(UserAdjectiveExpressionEntity, entitiesToSave);
    });
  }

  /**
   * getExpressionListUserCount 함수 대신해서 사용
   * 그리고 url의 총 인원수를 조회하는 코드를 inject후 조합하자
   * => 조립은 총 인원수 === 형용사 인원수 event 날려야함
   *
   * findUserAdjectiveExpressioList 이것도 대신가능할듯?
   * 이거는 find 그대로 쓰면 돼고 위에getExpressionListUserCount 이거는 한 층 더
   * 가공해서 써야한다
   */
  async find(dto: FindUserAdjectiveExpressionDto) {
    const findResult = await this.userAdjectiveExpressionRepository.find({
      where: {
        user: {
          urlId: dto.urlId,
        },
      },
      relations: {
        user: true,
        adjectiveExpression: true,
      },
      select: {
        user: {
          id: true,
          nickName: true,
          imgId: true,
        },
        adjectiveExpression: {
          adjective: true,
        },
      },
      order: {
        user: {
          createdAt: 'ASC',
        },
      },
    });

    const userAdjectiveExpressions = findResult.map((adjective) =>
      this.userAdjectiveExpressionFactory.reconstituteArray(
        adjective.user.id,
        adjective.user.nickName,
        adjective.user.imgId,
        adjective.adjectiveExpression.adjective,
      ),
    );

    return this._groupByUserId(userAdjectiveExpressions);
  }

  /**
   * 이 밑으로의 메서드 2개들은 서비스 코드로 따로 빼도 좋을 것 같다
   * vs
   *
   * find메서드를 없애고 groupByUserId 를 메인으로 가져간다.
   * groupByUserId에서 find + reduce
   *
   * 장단점/
   * 첫번째 방법으로 할 경우,,
   * 후처리 메서드가 필요하다 (user별로 그룹 묶는 메서드)
   * but, 직관적이고 활용도 높다
   *
   * 두번쨰 방법으로 할 경우,,
   * 유저 형용사 표현의 반환 데이터는 95% 유저와 그룹 지어서 반환해야한다.
   * (나머지 5%는 예상치 못한 기능이 생길 수 있다는 확률)
   * 5%가 존재하더라도 find + 그룹화 한 메서드로 있으면 이후에 활용도가 더 높다고 판단
   */
  // async countUniqueUsers(urlId: number): Promise<number> {
  //   const findResult = await this.find(urlId);

  //   const userIds = new Set<number>();
  //   findResult.forEach((item) => userIds.add(item.getUserId()));

  //   return userIds.size;
  // }

  private _groupByUserId(
    entities: UserAdjectiveExpression[],
  ): GroupByUserAdjectiveExpressionDto[] {
    const grouped = entities.reduce((acc, entity) => {
      if (!acc[entity.getUserId()]) {
        acc[entity.getUserId()] = {
          userId: entity.getUserId(),
          nickName: entity.getNickName(),
          imgId: entity.getImgId(),
          expressions: [],
        };
      }
      acc[entity.getUserId()].expressions.push(entity.getadjectiveExpression());
      return acc;
    }, {});

    return Object.values(grouped);
  }
}
