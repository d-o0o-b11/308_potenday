import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FindBalanceGameDto {
  @IsString()
  @ApiProperty({
    description: 'url',
    example: 'dsfdfs',
  })
  url: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description:
      '밸런스게임 총 4개 질문, 첫 번째 질문 balance_id=1 ... 마지막 질문 =4',
    example: 1,
  })
  balance_id: number;
}
