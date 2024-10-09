export class CommonQuestion {
  constructor(
    private readonly urlId: number,
    private readonly question1: boolean,
    private readonly question2: boolean,
    private readonly question3: boolean,
    private readonly question4: boolean,
  ) {}

  getUrlId(): Readonly<number> {
    return this.urlId;
  }

  getQuestion1(): Readonly<boolean> {
    return this.question1;
  }

  getQuestion2(): Readonly<boolean> {
    return this.question2;
  }

  getQuestion3(): Readonly<boolean> {
    return this.question3;
  }

  getQuestion4(): Readonly<boolean> {
    return this.question4;
  }
}
