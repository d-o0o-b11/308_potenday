import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBalanceGameDto {
  @IsString()
  @ApiProperty({
    description: 'url',
    example: 'dsfdfs',
  })
  url: string;

  @IsNumber()
  @ApiProperty({
    description:
      '밸런스게임 총 4개 질문, 첫 번째 질문 balance_id=1 ... 마지막 질문 =4',
    example: 1,
  })
  balance_id: number;

  @IsNumber()
  @ApiProperty({
    description: '유저 id',
    example: 1,
  })
  user_id: number;

  @IsString()
  @ApiProperty({
    description: '밸런스 게임 선택지',
    example: '불편한 상사랑 점심마다 소고기',
  })
  type: string;
}
