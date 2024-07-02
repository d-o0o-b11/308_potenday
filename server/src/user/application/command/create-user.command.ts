export class CreateUserCommand {
  constructor(
    public readonly urlId: number,
    public readonly imgId: number,
    public readonly nickName: string,
  ) {}
}
