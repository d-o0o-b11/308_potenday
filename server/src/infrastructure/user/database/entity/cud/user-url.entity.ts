import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from '@common';

@Entity('user_url')
export class UserUrlEntity extends BaseEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 364,
  })
  id: number;

  @Column({ type: 'varchar', name: 'url', nullable: false })
  url: string;

  @Column({ type: 'boolean', default: true, name: 'status', nullable: false })
  status: boolean;

  //1:n
  @OneToMany(() => UserEntity, (user) => user.url, {
    cascade: true,
    nullable: true,
  })
  user: UserEntity[];
}
