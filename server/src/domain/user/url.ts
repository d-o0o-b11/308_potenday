import { User } from './user';

export class Url {
  constructor(
    private readonly id: number,
    private readonly url: string,
    private readonly status: boolean,
    private readonly user?: User[],
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
    private readonly deletedAt?: Date,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getUrl(): Readonly<string> {
    return this.url;
  }

  getStatus(): Readonly<boolean> {
    return this.status;
  }

  getUserList(): Readonly<User[] | undefined> {
    return this.user;
  }

  getCreatedAt(): Readonly<Date> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<Date> {
    return this.updatedAt;
  }

  getDeletedAt(): Readonly<Date> {
    return this.deletedAt;
  }
}
