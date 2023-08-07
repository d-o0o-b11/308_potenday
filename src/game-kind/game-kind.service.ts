import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdjectiveExpressionEntity } from './entities/adjective-expression.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameKindService {
  constructor(
    @InjectRepository(AdjectiveExpressionEntity)
    private readonly adjectiveExpressionRepository: Repository<AdjectiveExpressionEntity>,
  ) {}

  async getAllExpressionList() {
    const findResult = await this.adjectiveExpressionRepository.find();

    return findResult;
  }
}
