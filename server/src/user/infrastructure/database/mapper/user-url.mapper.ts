import { UserUrlEntity } from '../entity';

export class UserUrlMapper {
  static toEntity(url: string): UserUrlEntity {
    const entity = new UserUrlEntity();
    entity.url = url;
    return entity;
  }
}
