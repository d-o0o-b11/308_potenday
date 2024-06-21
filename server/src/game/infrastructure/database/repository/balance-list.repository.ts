import { Injectable } from '@nestjs/common';
import { BalanceListEntity } from '../entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceListFactory, IBalanceListRepository } from '../../../domain';

@Injectable()
export class BalanceListRepository implements IBalanceListRepository {
  constructor(
    @InjectRepository(BalanceListEntity)
    private readonly balanceListRepository: Repository<BalanceListEntity>,
    private readonly balanceListFactory: BalanceListFactory,
  ) {}

  async find(balanceId: number) {
    const findResult = await this.balanceListRepository.findOne({
      where: {
        id: balanceId,
      },
    });

    return this.balanceListFactory.reconstitute(
      findResult.id,
      findResult.typeA,
      findResult.typeB,
    );
  }
}
