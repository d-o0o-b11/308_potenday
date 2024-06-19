import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserBalanceGameEntity } from '../../../../game-kind/entities/user-balance-game.entity';
import { MbtiChooseEntity } from '../../../../game-kind/entities/mbti-choose.entity';
import { BaseEntity } from '@common';
import { UserUrlEntity } from './user-url.entity';
import { UserAdjectiveExpressionEntity } from '../../../../game-kind/entities/user-adjective-expression.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Generated()
  @PrimaryColumn('int4')
  id: number;

  @Column({ type: 'int4', name: 'img_id', nullable: false })
  imgId: number;

  @Column({ type: 'varchar', name: 'nickname', nullable: false })
  nickName: string;

  @Column({ type: 'varchar', name: 'mbti', nullable: true })
  mbti: string;

  @Column({
    type: 'boolean',
    name: 'onboarding',
    default: false,
    nullable: false,
  })
  onboarding: boolean;

  @Column({ type: 'int4', name: 'url_id', nullable: false })
  urlId: number;

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
  mbtiChoose: MbtiChooseEntity[];

  @OneToMany(() => MbtiChooseEntity, (mbti) => mbti.toUser, {
    cascade: true,
    nullable: true,
  })
  mbtiChooseToUser: MbtiChooseEntity[];
}
