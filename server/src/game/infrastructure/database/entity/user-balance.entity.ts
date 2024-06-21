import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceListEntity } from './balance-list.entity';
import { UserEntity } from '@user';
import { BaseEntity } from '@common';

@Entity('user_balance')
export class UserBalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'int4', name: 'balance_id', nullable: false })
  balanceId: number;

  @Column({ type: 'varchar', name: 'balance_type', nullable: false })
  balanceType: string;

  @ManyToOne(() => UserEntity, (user) => user.userBalanceGames, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => BalanceListEntity,
    (balanceGame) => balanceGame.userBalanceGames,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'balance_id' })
  balanceGame: BalanceListEntity;
}
