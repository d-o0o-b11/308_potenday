import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FindMbtiRoundDto {
  @IsString()
  @ApiProperty({
    description: 'url',
    example: 'dsfdsfs',
  })
  url: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: '해당 라운드 아이디',
    example: 1,
  })
  round_id: number;
}
