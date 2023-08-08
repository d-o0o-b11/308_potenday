import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity('balance_game_list')
export class BalanceGameEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  @Column({ type: 'varchar' })
  type_A: string;

  @Column({ type: 'varchar' })
  type_B: string;
}
