import { BaseEntity } from '@common';
import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity('common_question')
export class CommonQuestionEntity extends BaseEntity {
  @Generated()
  @PrimaryColumn('int4')
  id: number;

  @Column({
    type: 'boolean',
    name: 'question_1',
    nullable: false,
    default: false,
  })
  question1: boolean;

  @Column({
    type: 'boolean',
    name: 'question_2',
    nullable: false,
    default: false,
  })
  question2: boolean;

  @Column({
    type: 'boolean',
    name: 'question_3',
    nullable: false,
    default: false,
  })
  question3: boolean;

  @Column({
    type: 'boolean',
    name: 'question_4',
    nullable: false,
    default: false,
  })
  question4: boolean;
}
