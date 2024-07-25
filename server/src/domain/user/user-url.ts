import { User } from './user';

export class UserUrl {
  constructor(
    private readonly id: number,
    private readonly url: string,
    private readonly status: boolean,
    private readonly user?: User[],
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
}
