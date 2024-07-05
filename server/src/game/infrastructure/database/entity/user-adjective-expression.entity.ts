import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdjectiveExpressionEntity } from './adjective-expression.entity';
import { BaseEntity } from '@common';
import { UserEntity } from '@user/infrastructure/database/entity/user.entity';

@Entity('user_adjective_expression')
export class UserAdjectiveExpressionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'int4', name: 'adjective_expression_id', nullable: false })
  adjectiveExpressionId: number;

  @ManyToOne(() => UserEntity, (user) => user.expressions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => AdjectiveExpressionEntity,
    (expression) => expression.userAdjectiveExpressions,
    {
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn({ name: 'adjective_expression_id' }) // 중간 테이블 지정
  adjectiveExpression: AdjectiveExpressionEntity;
}
