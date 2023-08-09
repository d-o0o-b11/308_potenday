import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateQuestionStatusDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '질문 id',
    example: 1,
  })
  question_id: number;

  @IsString()
  @ApiProperty({
    description: 'url',
    example: 'dsfdfdfsd',
  })
  url: string;
}
