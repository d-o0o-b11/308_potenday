export interface ICommonQuestionRepository {
  save: (urlId: number) => Promise<void>;
  update: (urlId: number, questionId: number) => Promise<void>;
}
