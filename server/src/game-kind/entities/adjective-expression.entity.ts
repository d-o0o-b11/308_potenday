import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { UserAdjectiveExpressionEntity } from './user-adjective-expression.entity';

@Entity('adjective_expression1')
export class AdjectiveExpressionEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  @Column({ type: 'varchar' })
  expression: string;

  @OneToMany(
    () => UserAdjectiveExpressionEntity,
    (expression) => expression.expressions,
    {
      cascade: true,
      nullable: true,
    },
  )
  expressions: UserAdjectiveExpressionEntity[];
}
