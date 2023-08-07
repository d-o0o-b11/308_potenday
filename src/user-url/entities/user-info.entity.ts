import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserUrlEntity } from './user-url.entity';

@Entity('user_info')
export class UserInfoEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  @Column({ type: 'int4' })
  url_id: number;

  @Column({ type: 'int4' })
  img_id: number;

  @Column({ type: 'varchar' })
  nickname: string;

  @CreateDateColumn()
  created_at: Date;

  //n:1
  @ManyToOne(() => UserUrlEntity, (url) => url.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;
}
