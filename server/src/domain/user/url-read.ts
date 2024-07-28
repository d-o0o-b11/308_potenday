export class UrlRead {
  constructor(
    private readonly urlId: number,
    private readonly url: string,
    private readonly status: boolean,
    private readonly createdAt: string,
    private readonly updatedAt: string,
    private readonly deletedAt: string | null,
    private readonly userIdList: number[],
  ) {}

  /**
   * @memo
   * userIdList <--user userUrl.getUserList() 수정
   * 하려고 했으나 userReadEntity에 이미 user 정보가 있는데 중복 저장이 아닐까..?
   * Id만 저장하는게 조금 더 맞는 것 같은 느낌이 든다.
   */

  getUrlId(): Readonly<number> {
    return this.urlId;
  }

  getUrl(): Readonly<string> {
    return this.url;
  }

  getStatus(): Readonly<boolean> {
    return this.status;
  }

  getCreatedAt(): Readonly<string> {
    return this.createdAt;
  }

  getUpdatedAt(): Readonly<string> {
    return this.updatedAt;
  }

  getDeletedAt(): Readonly<string | null> {
    return this.deletedAt;
  }

  getUserIdList(): Readonly<number[]> {
    return this.userIdList;
  }
}
