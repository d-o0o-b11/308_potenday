import { BaseEntity } from '@common';
import { UserUrlEntity } from '@user';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('common_question')
export class CommonQuestionEntity extends BaseEntity {
  @PrimaryColumn({ type: 'int4', name: 'url_id' })
  urlId: number;

  @Column({ type: 'boolean', name: 'question_1', nullable: false })
  question1: boolean;

  @Column({ type: 'boolean', name: 'question_2', nullable: false })
  question2: boolean;

  @Column({ type: 'boolean', name: 'question_3', nullable: false })
  question3: boolean;

  @Column({ type: 'boolean', name: 'question_4', nullable: false })
  question4: boolean;

  @OneToOne(() => UserUrlEntity, (url) => url.id, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;
}
