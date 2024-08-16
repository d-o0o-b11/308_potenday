import { CreateUserDto } from '@interface';
import { User } from '../user';
import { DeleteResult, EntityManager } from 'typeorm';

export interface IUserRepository {
  create: (dto: CreateUserDto) => Promise<User>;
  delete: (id: number, manager: EntityManager) => Promise<DeleteResult>;
}
