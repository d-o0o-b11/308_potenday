import {
  CreateUserDto,
  FindOneUserDto,
  UpdateOnboardingDto,
  UserResponseDto,
} from '../../interface';
import { User } from '../user';

export interface IUserRepository {
  save: (dto: CreateUserDto) => Promise<UserResponseDto>;
  updateOnboarding: (dto: UpdateOnboardingDto) => Promise<void>;
  findOne: (dto: FindOneUserDto) => Promise<User>;
}
