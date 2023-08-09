import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { UserBalanceGameEntity } from './user-balance-game.entity';

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

  @OneToMany(() => UserBalanceGameEntity, (balance) => balance.balance, {
    cascade: true,
    nullable: true,
  })
  balance: UserBalanceGameEntity[];
}
