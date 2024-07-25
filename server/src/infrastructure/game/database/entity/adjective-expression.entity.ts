import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { UserAdjectiveExpressionEntity } from './user-adjective-expression.entity';
import { IsIn } from 'class-validator';
import { Adjective, ADJECTIVES } from '@domain';

@Entity('adjective_expression')
export class AdjectiveExpressionEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  // @memo 생각해보기,,컬럼을 fit하게 맞출지 서버에서만 fit하게 맞출지에 대해서
  // @Column({
  //   type: 'enum',
  //   enum: [
  //     '꼼꼼한', '솔직한', '자신감있는', '사려깊은', '신중한', '쾌할한',
  //     '침착한', '내성적인', '외향적인', '긍정적인', '열정적인', '다정한',
  //     '부지런한', '정직한', '즉흥적인', '엉뚱한'
  //   ],
  //   nullable: false
  // })
  @Column({ type: 'varchar', name: 'adjective', nullable: false })
  @IsIn(Object.values(ADJECTIVES))
  adjective: Adjective;

  @OneToMany(
    () => UserAdjectiveExpressionEntity,
    (userAdjectiveExpression) => userAdjectiveExpression.adjectiveExpression,
    {
      onDelete: 'CASCADE',
    },
  )
  userAdjectiveExpressions: UserAdjectiveExpressionEntity[];
}
