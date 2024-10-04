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
import {
  UserAdjectiveExpressionEntity,
  UserBalanceEntity,
  UserMbtiEntity,
} from '@infrastructure';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Generated()
  @PrimaryColumn('int4')
  id: number;

  @Column({ type: 'int4', name: 'img_id', nullable: false })
  imgId: number;

  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

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
