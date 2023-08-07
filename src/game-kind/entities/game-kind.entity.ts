import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity('adjective_expression')
export class AdjectiveExpressionEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  @Column({ type: 'varchar' })
  expression: string;
}
