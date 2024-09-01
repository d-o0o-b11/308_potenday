import {
  CreateUserAdjectiveExpressionDto,
  IAdjectiveExpressionService,
} from '@interface';
import { Inject, Injectable } from '@nestjs/common';
import { SubmitAdjectiveExpressionException } from '@common';
import {
  ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN,
  ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN,
} from '@infrastructure';
import {
  IAdjectiveExpressionRepository,
  IAdjectiveExpressionRepositoryReadRepository,
} from '@domain';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SaveUserAdjectiveExpressionDto } from '../dto';

@Injectable()
export class AdjectiveExpressionService implements IAdjectiveExpressionService {
  constructor(
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private readonly adjectiveExpressionRepository: IAdjectiveExpressionRepository,
    @Inject(ADJECTIVE_EXPRESSION_REPOSITORY_READ_TOKEN)
    private readonly adjectiveExpressionReadRepository: IAdjectiveExpressionRepositoryReadRepository,
    @InjectEntityManager('read')
    private readonly readManager: EntityManager,
  ) {}

  /**
   * 재사용성 있는가 ? - X
   * 하나의 메서드를 넣기 위해 하나의 파일을 생성하는게 맞는가? - 모르겠다 (재사용성이 없어서 분리하는게 나을 것 같다. 게임 서비스 모두 해당)
   *
   * But, Handler에 해당 로직을 합칠 경우 가독성 떨어질 수 있다 + 단일 책임 원칙 위반 가능성 존재
   */
  async saveUserExpressionAndGetSubmitCount(
    dto: CreateUserAdjectiveExpressionDto,
  ) {
    if (
      await this.adjectiveExpressionReadRepository.isSubmitUser(
        dto.userId,
        this.readManager,
      )
    ) {
      throw new SubmitAdjectiveExpressionException();
    }

    const saveResult = await this.adjectiveExpressionRepository.create(
      new SaveUserAdjectiveExpressionDto(dto.userId, dto.expressionIdList),
    );

    const submitCount = (
      await this.adjectiveExpressionReadRepository.findUsersByUrlId(
        dto.urlId,
        this.readManager,
      )
    ).length;

    return { saveResult, submitCount: submitCount };
  }
}
