import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { BaseEntity } from '@common';
import { UserUrlEntity } from './user-url.entity';
import { UserAdjectiveExpressionEntity } from '@infrastructure/game/database/entity/user-adjective-expression.entity';
import { UserBalanceEntity } from '@infrastructure/game/database/entity/user-balance.entity';
import { UserMbtiEntity } from '@infrastructure/game/database/entity/user-mbti.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Generated()
  @PrimaryColumn('int4')
  id: number;

  @Column({ type: 'int4', name: 'img_id', nullable: false })
  imgId: number;

  @Column({ type: 'varchar', name: 'nickname', nullable: false })
  nickName: string;

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

  @OneToMany(() => UserBalanceEntity, (userBalance) => userBalance.user, {
    cascade: true,
    nullable: true,
  })
  userBalanceGames: UserBalanceEntity[];

  @OneToMany(() => UserMbtiEntity, (mbti) => mbti.user, {
    cascade: true,
    nullable: true,
  })
  mbtiChoose: UserMbtiEntity[];

  @OneToMany(() => UserMbtiEntity, (mbti) => mbti.toUser, {
    cascade: true,
    nullable: true,
  })
  mbtiChooseToUser: UserMbtiEntity[];
}
