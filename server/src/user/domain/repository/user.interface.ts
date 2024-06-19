import {
  CreateUserDto,
  FindOneUserDto,
  InsertMbtiDto,
  UpdateOnboardingDto,
  UserResponseDto,
} from '../../interface';
import { User } from '../user';

export interface IUserRepository {
  save: (dto: CreateUserDto) => Promise<UserResponseDto>;
  insertMbti: (dto: InsertMbtiDto) => Promise<void>;
  updateOnboarding: (dto: UpdateOnboardingDto) => Promise<void>;
  findOne: (dto: FindOneUserDto) => Promise<User>;
}
