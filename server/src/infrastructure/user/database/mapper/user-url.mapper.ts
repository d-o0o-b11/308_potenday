import { UrlRead } from '@domain';
import { UserUrlEntity } from '../entity/cud/user-url.entity';
import { UrlReadEntity } from '../entity/read/url-read.entity';

export class UserUrlMapper {
  static toEntity(url: string): UserUrlEntity {
    const entity = new UserUrlEntity();
    entity.url = url;
    return entity;
  }

  static toEntityRead(urlRead: UrlRead): UrlReadEntity {
    const entity = new UrlReadEntity();
    entity.data = urlRead;
    return entity;
  }
}
