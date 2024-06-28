import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdjectiveExpressionFactory,
  IAdjectiveExpressionRepository,
} from '../../../domain';
import { AdjectiveExpressionEntity } from '../entity/adjective-expression.entity';

@Injectable()
export class AdjectiveExpressionRepository
  implements IAdjectiveExpressionRepository
{
  constructor(
    @InjectRepository(AdjectiveExpressionEntity)
    private adjectiveExpressionRepository: Repository<AdjectiveExpressionEntity>,
    private adjectiveExpressionFactory: AdjectiveExpressionFactory,
  ) {}

  async find() {
    const findResult = await this.adjectiveExpressionRepository.find({
      order: {
        id: 'ASC',
      },
    });

    const result = findResult.map((adjective) =>
      this.adjectiveExpressionFactory.reconstituteArray(
        adjective.id,
        adjective.adjective,
      ),
    );

    return result;
  }
}
