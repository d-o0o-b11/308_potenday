import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommonQuestionCommand } from './create-common-question.command';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CommonQuestionMapper, EVENT_REPOSITORY_TOKEN } from '@infrastructure';
import { CommonQuestionEntity } from '@infrastructure/game/database/entity/cud/common-question.entity';
import { Inject } from '@nestjs/common';
import { IEventRepository } from '@domain';

@CommandHandler(CreateCommonQuestionCommand)
export class CreateCommonQuestionCommandHandler
  implements ICommandHandler<CreateCommonQuestionCommand>
{
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @Inject(EVENT_REPOSITORY_TOKEN)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(command: CreateCommonQuestionCommand): Promise<void> {
    const { urlId } = command;

    return await this.manager.transaction(async (manager) => {
      const entity = CommonQuestionMapper.toEntity(urlId);
      this.eventRepository.create(
        {
          eventType: 'CreateCommonQuestionCommand',
          eventMethod: 'save',
        },
        this.manager,
      );

      await manager.save(CommonQuestionEntity, entity);
    });
  }
}
