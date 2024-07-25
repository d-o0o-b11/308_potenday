import {
  CreateUserAdjectiveExpressionDto,
  IUserAdjectiveExpressionService,
} from '@interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserSubmitAdjectiveExpressionException } from '@common';
import { USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN } from '@infrastructure';
import { IUserAdjectiveExpressionRepository } from '@domain';

@Injectable()
export class UserAdjectiveExpressionService
  implements IUserAdjectiveExpressionService
{
  constructor(
    @Inject(USER_ADJECTIVE_EXPRESSION_REPOSITORY_TOKEN)
    private userAdjectiveExpressionRepository: IUserAdjectiveExpressionRepository,
  ) {}

  async saveUserExpressionAndGetSubmitCount(
    dto: CreateUserAdjectiveExpressionDto,
  ) {
    if (await this.userAdjectiveExpressionRepository.isSubmitUser(dto.userId)) {
      throw new UserSubmitAdjectiveExpressionException();
    }

    await this.userAdjectiveExpressionRepository.save({
      userId: dto.userId,
      expressionIds: dto.expressionIds,
    });

    const submitCount = (
      await this.userAdjectiveExpressionRepository.find({ urlId: dto.urlId })
    ).length;

    return { submitCount: submitCount };
  }
}
