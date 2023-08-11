import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserUrlEntity } from './user-url.entity';
import { UserAdjectiveExpressionEntity } from 'src/game-kind/entities/user-adjective-expression.entity';
import { UserBalanceGameEntity } from 'src/game-kind/entities/user-balance-game.entity';
import { MbtiChooseEntity } from 'src/game-kind/entities/mbti-choose.entity';

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

  @Column({ type: 'varchar', nullable: true })
  mbti: string;

  @Column({ type: 'boolean', default: false })
  onboarding: boolean;

  @CreateDateColumn()
  created_at: Date;

  //n:1
  @ManyToOne(() => UserUrlEntity, (url) => url.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;

  @OneToMany(
    () => UserAdjectiveExpressionEntity,
    (expression) => expression.user,
    {
      cascade: true,
      nullable: true,
    },
  )
  expressions: UserAdjectiveExpressionEntity[];

  @OneToMany(() => UserBalanceGameEntity, (balance) => balance.user, {
    cascade: true,
    nullable: true,
  })
  balance: UserBalanceGameEntity[];

  @OneToMany(() => MbtiChooseEntity, (mbti) => mbti.user, {
    cascade: true,
    nullable: true,
  })
  mbti_choose: MbtiChooseEntity[];

  @OneToMany(() => MbtiChooseEntity, (mbti) => mbti.toUser, {
    cascade: true,
    nullable: true,
  })
  mbti_choose_to_user: MbtiChooseEntity[];
}
