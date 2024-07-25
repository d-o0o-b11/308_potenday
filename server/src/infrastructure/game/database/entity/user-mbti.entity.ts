import { BaseEntity } from '@common';
import { UserEntity } from '@infrastructure/user/database/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_mbti')
export class UserMbtiEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', name: 'mbti', nullable: true })
  mbti: string;

  @Column({ type: 'varchar', name: 'to_user_id', nullable: false })
  toUserId: number;

  @ManyToOne(() => UserEntity, (user) => user.mbtiChoose, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.mbtiChooseToUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_user_id' }) // to_user_id를 조인 컬럼으로 설정
  toUser: UserEntity;
}
