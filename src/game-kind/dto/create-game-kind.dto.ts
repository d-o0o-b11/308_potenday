import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateGameKindDto {
  @IsNumber()
  @ApiProperty({
    description: '유저 id',
    example: 1,
  })
  user_id: number;

  @IsArray()
  @ApiProperty({
    description: '형용사 표현 id',
    example: [12, 9],
  })
  expression_id: number[];
}
