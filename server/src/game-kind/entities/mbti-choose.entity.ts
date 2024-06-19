import { IsDate } from 'class-validator';
import { UserInfoEntity } from '../../user-url/entities/user-info.entity';
import { UserUrlEntity } from '../../user-url/entities/user-url.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('mbti_choose')
export class MbtiChooseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  url_id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'varchar', nullable: true })
  mbti: string;

  @Column({ type: 'varchar', nullable: true })
  to_user_id: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @ManyToOne(() => UserUrlEntity, (url) => url.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;

  @ManyToOne(() => UserInfoEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserInfoEntity;

  @ManyToOne(() => UserInfoEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_user_id' }) // to_user_id를 조인 컬럼으로 설정
  toUser: UserInfoEntity;
}
