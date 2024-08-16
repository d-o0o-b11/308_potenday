import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity('balance_list')
export class BalanceListEntity {
  @Generated()
  @PrimaryColumn('int4')
  id: number;

  @Column({ type: 'varchar', name: 'type_A', nullable: false })
  typeA: string;

  @Column({ type: 'varchar', name: 'type_B', nullable: false })
  typeB: string;
}
