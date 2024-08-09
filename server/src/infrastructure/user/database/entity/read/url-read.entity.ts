import { UrlRead } from '@domain';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('url')
export class UrlReadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: false })
  data: UrlRead;
}
