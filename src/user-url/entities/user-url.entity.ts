import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserInfoEntity } from './user-info.entity';

@Entity('user_url')
export class UserUrlEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 364,
  })
  id: number;

  @Column({ type: 'varchar' })
  url: string;

  //사용 가능 true
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  //1:n
  @OneToMany(() => UserInfoEntity, (user) => user.url, {
    cascade: true,
    nullable: true,
  })
  user: UserInfoEntity[];
}
