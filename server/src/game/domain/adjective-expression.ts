import { Adjective } from './enums';

export class AdjectiveExpression {
  constructor(
    private readonly id: number,
    private readonly adjective: Adjective,
  ) {}

  getId(): Readonly<number> {
    return this.id;
  }

  getAdjective(): Readonly<Adjective> {
    return this.adjective;
  }
}
