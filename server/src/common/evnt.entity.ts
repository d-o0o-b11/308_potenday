import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('event_log')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  aggregateId: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column('json')
  payload: any;

  @CreateDateColumn()
  createdAt: Date;
}
