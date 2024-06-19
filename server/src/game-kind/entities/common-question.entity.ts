import { UserUrlEntity } from '../../user-url/entities/user-url.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('common_question')
export class CommonQuestionEntity {
  @PrimaryColumn('int4')
  url_id: number;

  @Column({ type: 'boolean', default: false })
  question_1: boolean;

  @Column({ type: 'boolean', default: false })
  question_2: boolean;

  @Column({ type: 'boolean', default: false })
  question_3: boolean;

  @Column({ type: 'boolean', default: false })
  question_4: boolean;

  @OneToOne(() => UserUrlEntity, (url) => url.id, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'url_id' })
  url: UserUrlEntity;
}
