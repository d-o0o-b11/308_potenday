import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUrlStatusQuery } from './get-url-status.query';
import { URL_READ_REPOSITORY_TOKEN } from '@infrastructure';
import { GetUrlStatusResponseDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IUrlReadRepository } from '@domain';
import { FindOneByUrlIdDto } from '@application';

@QueryHandler(GetUrlStatusQuery)
export class GetUrlStatusHandler implements IQueryHandler<GetUrlStatusQuery> {
  constructor(
    @Inject(URL_READ_REPOSITORY_TOKEN)
    private readonly urlReadRepository: IUrlReadRepository,
    @InjectEntityManager('read') private readonly readManager: EntityManager,
  ) {}

  /**
   * 단순 조회 작업엔 이벤트 소싱 X
   */
  async execute(query: GetUrlStatusQuery): Promise<GetUrlStatusResponseDto> {
    const { urlId } = query;
    const findResult = await this.urlReadRepository.findOneById(
      new FindOneByUrlIdDto(urlId),
      this.readManager,
    );

    return { status: findResult.getStatus() };
  }
}
