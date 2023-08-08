import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceGameEntity } from '../entities/balance-game-list.entity';
import { CommonQuestionEntity } from '../entities/common-question.entity';

@Injectable()
export class BalanceGameService {
  constructor(
    @InjectRepository(CommonQuestionEntity)
    private readonly commonQuestionEntityRepository: Repository<CommonQuestionEntity>,

    @InjectRepository(BalanceGameEntity)
    private readonly balanceGameEntityRepository: Repository<BalanceGameEntity>,
  ) {}
}
