import { Injectable } from '@nestjs/common';
import { UserUrl } from '../user-url';
import {
  CreateUserUrlReadDto,
  ReconstituteFactoryDto,
  ReconstituteFindFactoryDto,
  ReconstituteWithUserFactoryDto,
} from '@interface';
import { UrlRead } from '../url-read';

@Injectable()
export class UserUrlFactory {
  reconstitute(dto: ReconstituteFactoryDto): UserUrl {
    return new UserUrl(
      dto.id,
      dto.url,
      dto.status,
      null,
      dto?.createdAt,
      dto?.updatedAt,
      dto?.deletedAt,
    );
  }

  reconstituteWithUser(dto: ReconstituteWithUserFactoryDto): UserUrl {
    return new UserUrl(dto.id, dto.url, dto.status, dto.users);
  }

  reconstituteRead(dto: CreateUserUrlReadDto) {
    return new UrlRead(
      dto.urlId,
      dto.url,
      dto.status,
      dto.createdAt,
      dto.updatedAt,
      dto.deletedAt,
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
