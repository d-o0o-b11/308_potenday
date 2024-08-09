import {
  CreateUserUrlDto,
  FindOneUserUrlWithUserDto,
  UpdateUserUrlDto,
} from '@interface';
import { UserUrl } from '../user-url';
import { DeleteResult, EntityManager } from 'typeorm';

export interface IUserUrlRepository {
  save: (dto: CreateUserUrlDto, manager: EntityManager) => Promise<UserUrl>;
  update: (dto: UpdateUserUrlDto, manager: EntityManager) => Promise<void>;
  // findOne: (dto: FindOneUserUrlDto) => Promise<UserUrl>;
  findOneWithUser: (dto: FindOneUserUrlWithUserDto) => Promise<UserUrl>;
  // findOneWithUrl(
  //   dto: FindOneUserWithUrlDto,
  //   manager: EntityManager,
  // ): Promise<boolean>;
  delete(id: number, manager: EntityManager): Promise<DeleteResult>;
}
