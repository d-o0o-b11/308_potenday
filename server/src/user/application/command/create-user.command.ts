export class CreateUserCommand {
  constructor(
    public readonly url: string,
    public readonly imgId: number,
    public readonly nickName: string,
  ) {}
}
