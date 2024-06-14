import { UserInfoEntity } from 'src/user-url/entities/user-info.entity';
import { UserUrlEntity } from 'src/user-url/entities/user-url.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BalanceGameEntity } from './balance-game-list.entity';
import { IsDate } from 'class-validator';

@Entity('user_balance_game')
export class UserBalanceGameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  url_id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'varchar' })
  balance_type: string;

  @Column({ type: 'int4' })
  balance_id: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @ManyToOne(() => UserUrlEntity, (url) => url.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;

  @ManyToOne(() => UserInfoEntity, (user) => user.expressions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserInfoEntity;

  @ManyToOne(() => BalanceGameEntity, (balance) => balance.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'balance_id' })
  balance: BalanceGameEntity;
}
