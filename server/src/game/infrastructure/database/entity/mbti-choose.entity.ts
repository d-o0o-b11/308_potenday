import { BaseEntity } from '@common';
import { UserEntity, UserUrlEntity } from '@user';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('mbti_choose')
export class MbtiChooseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'url_id', nullable: false })
  urlId: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  mbti: string;

  @Column({ type: 'varchar', name: 'to_user_id', nullable: false })
  toUserId: number;

  @ManyToOne(() => UserUrlEntity, (url) => url.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_user_id' }) // to_user_id를 조인 컬럼으로 설정
  toUser: UserEntity;
}
