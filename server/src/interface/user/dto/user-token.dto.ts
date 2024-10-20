export class UserTokenDto {
  constructor(
    public readonly userId: number,
    public readonly urlId: number,
  ) {}
}
