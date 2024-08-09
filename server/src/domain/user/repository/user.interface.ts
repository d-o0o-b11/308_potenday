import { CreateUserDto } from '@interface';
import { User } from '../user';

export interface IUserRepository {
  create: (dto: CreateUserDto) => Promise<User>;
}
