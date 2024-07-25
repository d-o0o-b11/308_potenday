import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'delete_at' })
  deleteAt: Date;
}
