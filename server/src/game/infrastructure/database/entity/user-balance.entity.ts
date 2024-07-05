import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceListEntity } from './balance-list.entity';
import { BaseEntity } from '@common';
import { IsEnum } from 'class-validator';
import { BalanceType } from '../../../domain';
import { UserEntity } from '@user/infrastructure/database/entity/user.entity';

@Entity('user_balance')
export class UserBalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'int4', name: 'balance_id', nullable: false })
  balanceId: number;

  @Column({ type: 'varchar', name: 'balance_type', nullable: false })
  @IsEnum(BalanceType)
  balanceType: BalanceType;

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
