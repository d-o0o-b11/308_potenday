import { Injectable } from '@nestjs/common';
import { Url } from '../url';
import { UrlRead } from '../url-read';
import {
  CreateUserUrlReadDto,
  ReconstituteFactoryDto,
  ReconstituteFindFactoryDto,
} from '@application';

@Injectable()
export class UrlFactory {
  reconstitute(raw: ReconstituteFactoryDto): Url {
    return new Url(
      raw.id,
      raw.url,
      raw.status,
      null,
      raw?.createdAt,
      raw?.updatedAt,
      raw?.deletedAt,
    );
  }

  reconstituteRead(dto: CreateUserUrlReadDto) {
    return new UrlRead(
      dto.urlId,
      dto.url,
      dto.status,
      dto.createdAt,
      dto.updatedAt,
      dto.deletedAt,
      null,
    );
  }

  reconstituteFind(raw: ReconstituteFindFactoryDto): UrlRead {
    return new UrlRead(
      raw.urlId,
      raw.url,
      raw.status,
      null,
      null,
      null,
      raw.userIdList,
    );
  }
}
