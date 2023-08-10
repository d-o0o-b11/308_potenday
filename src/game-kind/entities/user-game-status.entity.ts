import { UserInfoEntity } from 'src/user-url/entities/user-info.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('user_game_status')
export class UserGameStatusEntity {
  @PrimaryColumn('int4')
  user_id: number;

  @Column({ type: 'boolean', default: false })
  adjective_status: boolean;

  @Column({ type: 'boolean', default: false })
  balance_status: boolean;

  @Column({ type: 'boolean', default: false })
  mbti_status: boolean;

  @OneToOne(() => UserInfoEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserInfoEntity;
}
