import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserInfoEntity } from 'src/user-url/entities/user-info.entity';

@Entity('balance_game_list')
export class BalanceGameEntity {
  @Generated()
  @PrimaryColumn('int4')
  @ApiProperty({
    description: 'PK',
    type: Number,
    example: 1,
  })
  id: number;

  @Column({ type: 'varchar' })
  type_A: string;

  @Column({ type: 'varchar' })
  type_B: string;

  //   @Column({ type: 'int4' })
  //   user_id: number;

  //   @ManyToOne(() => UserInfoEntity, (user) => user.balance, {
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'user_id' }) // 중간 테이블 지정
  //   user: UserInfoEntity;
}
