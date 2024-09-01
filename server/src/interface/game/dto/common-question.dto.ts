import { IsNumber } from 'class-validator';

export class PatchCommonQuestionDto {
  /**
   * URL ID
   * @example 37
   */
  @IsNumber()
  urlId: number;
}
