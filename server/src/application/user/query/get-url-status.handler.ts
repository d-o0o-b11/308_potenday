import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetUrlStatusQuery } from './get-url-status.query';
import { UrlReadRepository } from '@infrastructure';
import { FindOneByUrlIdDto, GetUrlStatusResponseDto } from '@interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
@QueryHandler(GetUrlStatusQuery)
export class GetUrlStatusHandler implements IQueryHandler<GetUrlStatusQuery> {
  constructor(
    private urlReadRepository: UrlReadRepository,
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
