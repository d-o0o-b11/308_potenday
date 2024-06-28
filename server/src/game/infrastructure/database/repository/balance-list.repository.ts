import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceListFactory, IBalanceListRepository } from '../../../domain';
import { FindBalanceListDto } from '../../../interface';
import { BalanceListEntity } from '../entity/balance-list.entity';

@Injectable()
export class BalanceListRepository implements IBalanceListRepository {
  constructor(
    @InjectRepository(BalanceListEntity)
    private readonly balanceListRepository: Repository<BalanceListEntity>,
    private readonly balanceListFactory: BalanceListFactory,
  ) {}

  async find(dto: FindBalanceListDto) {
    const findResult = await this.balanceListRepository.findOne({
      where: {
        id: dto.balanceId,
      },
    });

    return this.balanceListFactory.reconstitute(
      findResult.id,
      findResult.typeA,
      findResult.typeB,
    );
  }
}
