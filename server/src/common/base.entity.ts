import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'date', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date', name: 'update_at' })
  updateAt: Date;

  @DeleteDateColumn({ type: 'date', name: 'delete_at' })
  deleteAt: Date;
}
