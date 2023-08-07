import { UserInfoEntity } from 'src/user-url/entities/user-info.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdjectiveExpressionEntity } from './adjective-expression.entity';

@Entity('user_adjective_expression')
export class UserAdjectiveExpressionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int4' })
  user_id: number;

  @Column({ type: 'int4' })
  expression_id: number;

  @ManyToOne(() => UserInfoEntity, (user) => user.expressions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserInfoEntity;

  @ManyToOne(
    () => AdjectiveExpressionEntity,
    (expression) => expression.expressions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'expression_id' }) // 중간 테이블 지정
  expressions: AdjectiveExpressionEntity;
}
