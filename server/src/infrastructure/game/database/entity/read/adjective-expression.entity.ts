import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';
import { IsIn } from 'class-validator';
import { Adjective, ADJECTIVES } from '@domain';

@Entity('adjective_expression')
export class AdjectiveExpressionReadEntity {
  @Generated()
  @PrimaryColumn('int4')
  id: number;

  @Column({ type: 'varchar', name: 'adjective', nullable: false })
  @IsIn(Object.values(ADJECTIVES))
  adjective: Adjective;
}
