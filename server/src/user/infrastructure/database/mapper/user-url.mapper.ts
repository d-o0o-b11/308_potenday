import { UserUrlEntity } from '../entity/user-url.entity';

export class UserUrlMapper {
  static toEntity(url: string): UserUrlEntity {
    const entity = new UserUrlEntity();
    entity.url = url;
    return entity;
  }
}
