import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdjectiveExpressionEntity } from './adjective-expression.entity';
import { UserEntity } from '@user';
import { BaseEntity } from '@common';

@Entity('user_adjective_expression')
export class UserAdjectiveExpressionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'int4', name: 'expression_id', nullable: false })
  expressionId: number;

  constructor(data: Partial<UserAdjectiveExpressionEntity>) {
    super();
    Object.assign(this, data);
  }

  @ManyToOne(() => UserEntity, (user) => user.expressions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(
    () => AdjectiveExpressionEntity,
    (expression) => expression.expressionList,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'expression_id' }) // 중간 테이블 지정
  expressions: AdjectiveExpressionEntity;
}
