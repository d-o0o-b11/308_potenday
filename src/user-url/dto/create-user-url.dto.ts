import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserUrlDto {
  @IsNumber()
  @ApiProperty({
    description: '이미지 Id',
    example: 1,
  })
  img_id: number;

  @IsString()
  @ApiProperty({
    description: '닉네임',
    example: '지민',
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: '해당 url',
    example: 'sdfdsfsd223',
  })
  url: string;
}
