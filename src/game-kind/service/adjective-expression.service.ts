import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdjectiveExpressionEntity } from '../entities/adjective-expression.entity';
import { Repository } from 'typeorm';
import { UserAdjectiveExpressionEntity } from '../entities/user-adjective-expression.entity';
import { CreateGameKindDto } from '../dto/create-game-kind.dto';
import { UserUrlService } from 'src/user-url/user-url.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameKindMapper } from '../mapper/game-kind.mapper';

@Injectable()
export class AdjectiveExpressionService {
  constructor(
    @InjectRepository(AdjectiveExpressionEntity)
    private readonly adjectiveExpressionRepository: Repository<AdjectiveExpressionEntity>,

    @InjectRepository(UserAdjectiveExpressionEntity)
    private readonly userAdjectiveExpressionRepository: Repository<UserAdjectiveExpressionEntity>,

    private readonly userUrlService: UserUrlService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  //모든 형용사 출력
  async getAllExpressionList() {
    const findResult = await this.adjectiveExpressionRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return findResult;
  }

  //형용사 표현 저장 (개인)
  async saveUserExpressionList(dto: CreateGameKindDto) {
    const { url, user_id, expression_id } = dto;

    const userAdjectiveExpressions: UserAdjectiveExpressionEntity[] = [];

    for (const id of expression_id) {
      const userAdjectiveExpression =
        GameKindMapper.toUserAdjectiveExpressionEntity(user_id, id);

      userAdjectiveExpressions.push(userAdjectiveExpression);
    }

    const saveResult = await this.userAdjectiveExpressionRepository.save(
      userAdjectiveExpressions,
    );

    await this.getExpressionListUserCount(url);

    return saveResult;
  }

  //몇명이 형용사 표현 저장했는지
  private async getExpressionListUserCount(url: string) {
    const findResult = await this.userUrlService.countUserAdjectiveExpression(
      url,
    );

    const findCountUser = await this.userUrlService.countUserToWaitingRoom(url);

    let next = true;
    //다르면 false
    if (findResult !== findCountUser.userCount) {
      next = false;
    } else {
      //같으면 sse
      this.eventEmitter.emit('statusUpdated', { url: url, status: true });
    }

    return { finish_user: findResult, next: next };
  }

  //사용자가 선택한 모든 형용사 표현 출력
  async findUserAdjectiveExpressioList(url: string, order?: boolean) {
    let findResult;
    if (order) {
      findResult =
        await this.userUrlService.findUserAdjectiveExpressioListOrder(url);
    } else {
      findResult = await this.userUrlService.findUserAdjectiveExpressioList(
        url,
      );
    }

    const expressionsArray = findResult.user.map((user) => user.expressions);

    const filterExpression = expressionsArray.map((expressions) =>
      expressions.map((expression) => expression.expressions.expression),
    );

    const result = [];
    for (let i = 0; i < findResult.user.length; i++) {
      result.push({
        img_id: findResult.user[i].img_id,
        nickname: findResult.user[i].nickname,
        expressions: filterExpression[i],
      });
    }

    return result;
  }
}
