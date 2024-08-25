import { Injectable } from '@nestjs/common';
import { Url } from '../url';
import {
  CreateUserUrlReadDto,
  ReconstituteFactoryDto,
  ReconstituteFindFactoryDto,
  ReconstituteWithUserFactoryDto,
} from '@interface';
import { UrlRead } from '../url-read';

@Injectable()
export class UrlFactory {
  reconstitute(dto: ReconstituteFactoryDto): Url {
    return new Url(
      dto.id,
      dto.url,
      dto.status,
      null,
      dto?.createdAt,
      dto?.updatedAt,
      dto?.deletedAt,
    );
  }

  reconstituteWithUser(dto: ReconstituteWithUserFactoryDto): Url {
    return new Url(dto.id, dto.url, dto.status, dto.users);
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
      [false, false, false, false],
    );
  }

  reconstituteFind(dto: ReconstituteFindFactoryDto): UrlRead {
    return new UrlRead(
      dto.urlId,
      dto.url,
      dto.status,
      null,
      null,
      null,
      dto.userIdList,
    );
  }
}
