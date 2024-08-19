import {
  CreateUserAdjectiveExpressionDto,
  IAdjectiveExpressionService,
} from '@interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserSubmitAdjectiveExpressionException } from '@common';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import {
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryRead,
} from '@domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class AdjectiveExpressionService implements IAdjectiveExpressionService {
  constructor(
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private readonly adjectiveExpressionRepository: IAdjectiveExpressionRepository,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryRead,
    @InjectEntityManager('read')
    private readonly readManager: EntityManager,
  ) {}

  async saveUserExpressionAndGetSubmitCount(
    dto: CreateUserAdjectiveExpressionDto,
  ) {
    if (
      await this.adjectiveExpressionReadRepository.isSubmitUser(
        dto.userId,
        this.readManager,
      )
    ) {
      throw new UserSubmitAdjectiveExpressionException();
    }

    const saveResult = await this.adjectiveExpressionRepository.create({
      urlId: dto.urlId,
      userId: dto.userId,
      expressionIdList: dto.expressionIdList,
    });

    const submitCount = (
      await this.adjectiveExpressionReadRepository.findUsersByUrlId(
        dto.urlId,
        this.readManager,
      )
    ).length;

    return { saveResult, submitCount: submitCount };
  }
}
