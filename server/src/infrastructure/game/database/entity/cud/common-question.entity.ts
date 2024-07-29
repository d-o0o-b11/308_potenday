import { BaseEntity } from '@common';
import { UserUrlEntity } from '@infrastructure/user/database/entity/cud/user-url.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('common_question')
export class CommonQuestionEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int4', name: 'url_id' })
  urlId: number;

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

  @OneToOne(() => UserUrlEntity, (url) => url.question, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;
}
