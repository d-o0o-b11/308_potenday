export class BalanceList {
  constructor(
    private readonly id: number,
    private readonly typeA: string,
    private readonly typeB: string,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getTypeA(): Readonly<string> {
    return this.typeA;
  }

  getTypeB(): Readonly<string> {
    return this.typeB;
  }
}
