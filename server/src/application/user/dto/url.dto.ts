export class CreateUserUrlDto {
  constructor(public readonly url: string) {}
}

export class UpdateUserUrlDto {
  constructor(public readonly status: boolean) {}
}

export class FindOneUserUrlDto {
  constructor(public readonly urlId: number) {}
}

export class FindOneUserWithUrlDto {
  constructor(public readonly url: string) {}
}

export class ReconstituteFactoryDto {
  constructor(
    public readonly id: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date,
  ) {}
}

export class ReconstituteFindFactoryDto {
  constructor(
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly userIdList: number[] | null,
  ) {}
}

export class CreateUserUrlReadDto {
  constructor(
    public readonly urlId: number,
    public readonly url: string,
    public readonly status: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}

export class UpdateUserUrlStatusDto {
  constructor(public readonly status: boolean) {}
}

export class FindOneByUrlIdDto {
  constructor(public readonly urlId: number) {}
}

export class UpdateUserIdDto {
  constructor(public readonly userId: number) {}
}

export class DeleteUserIdDto {
  constructor(public readonly userId: number) {}
}
