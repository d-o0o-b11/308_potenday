import { Injectable } from '@nestjs/common';
import { IUserRepository, UserFactory } from '../../../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entity';
import {
  CreateUserDto,
  FindOneUserDto,
  UpdateOnboardingDto,
} from '../../../interface';
import { UserMapper } from '../mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private manager: EntityManager,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) {}

  async save(dto: CreateUserDto) {
    return await this.manager.transaction(async (manager) => {
      const userEntity = UserMapper.toEntity(dto);
      const result = await manager.save(userEntity);

      return {
        id: result.id,
        imgId: result.imgId,
        nickName: result.nickName,
        onboarding: result.onboarding,
        urlId: result.urlId,
      };
    });
  }

  async updateOnboarding(dto: UpdateOnboardingDto) {
    await this.manager.transaction(async (manager) => {
      const updateResult = await manager.update(UserEntity, dto.userId, {
        onboarding: true,
      });

      if (!updateResult.affected)
        throw new Error('onboarding 상태 업데이트 실패');
    });
  }

  /**
   * @memo
   * entity 반환값 사용 x => 도메인 모델 사용 o
   */
  async findOne(dto: FindOneUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.userId,
      },
    });

    return this.userFactory.reconstitute(
      user.id,
      user.imgId,
      user.nickName,
      user.urlId,
      user.onboarding,
    );
  }
}
