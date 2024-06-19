import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { CommonQuestionEntity } from '../../../../game-kind/entities/common-question.entity';
import { UserBalanceGameEntity } from '../../../../game-kind/entities/user-balance-game.entity';
import { MbtiChooseEntity } from '../../../../game-kind/entities/mbti-choose.entity';
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

  @OneToOne(() => CommonQuestionEntity, (question) => question.url, {
    onDelete: 'CASCADE',
  })
  question: CommonQuestionEntity;

  @OneToMany(() => UserBalanceGameEntity, (balance) => balance.url, {
    cascade: true,
    nullable: false,
  })
  balance: UserBalanceGameEntity;

  @OneToMany(() => MbtiChooseEntity, (mbti) => mbti.url, {
    cascade: true,
    nullable: false,
  })
  mbti: MbtiChooseEntity[];
}
