import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { UserBalanceEntity } from './user-balance.entity';

@Entity('balance_list')
export class BalanceListEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  @Column({ type: 'varchar', name: 'type_A', nullable: false })
  typeA: string;

  @Column({ type: 'varchar', name: 'type_B', nullable: false })
  typeB: string;

  @OneToMany(
    () => UserBalanceEntity,
    (userBalanceGame) => userBalanceGame.balanceGame,
    {
      cascade: true,
      nullable: true,
    },
  )
  userBalanceGames: UserBalanceEntity[];
}
