import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('event_log')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //CreateUrlEvent, UserRegisteredEvent 같은 유형을 기록
  @Column({ type: 'varchar', name: 'type' })
  type: string;

  //해당 이벤트 상태
  @Column({ type: 'varchar', name: 'method' })
  method: string;

  //이벤트의 세부 정보. JSON 형식으로 이벤트의 모든 필드 기록
  @Column({ type: 'jsonb', name: 'event' })
  event: object;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  constructor(data: Partial<EventEntity>) {
    Object.assign(this, data);
  }
}
