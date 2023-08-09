import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SaveMbtiRoundDto {
  @IsString()
  @ApiProperty({
    description: 'url',
    example: 'dsfdsfs',
  })
  url: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: '본인 id',
    example: 1,
  })
  user_id: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description: '해당 라운드 아이디',
    example: 1,
  })
  round_id: number;

  @IsString()
  @ApiProperty({
    description: 'mbti',
    example: 'ISTJ',
  })
  mbti: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    description:
      '어떤 유저의 id 차례인지 (해당 라운드가 어떤 유저의 mbti 맞추는 차례인지, 투표할 user_id)',
    example: 4,
  })
  to_user_id: number;
}
