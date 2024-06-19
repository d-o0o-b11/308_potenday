import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceGameEntity } from './balance-game-list.entity';
import { UserEntity, UserUrlEntity } from '@user';
import { BaseEntity } from '@common';

@Entity('user_balance_game')
export class UserBalanceGameEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'url_id', nullable: false })
  urlId: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', name: 'balance_type', nullable: false })
  balanceType: string;

  @Column({ type: 'int4', name: 'balance_id', nullable: false })
  balanceId: number;

  @ManyToOne(() => UserUrlEntity, (url) => url.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;

  @ManyToOne(() => UserEntity, (user) => user.expressions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BalanceGameEntity, (balance) => balance.balanceList, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'balance_id' })
  balance: BalanceGameEntity;
}
