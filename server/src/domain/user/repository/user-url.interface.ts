import {
  CreateUserUrlDto,
  FindOneUserUrlWithUserDto,
  UpdateUserUrlDto,
} from '@interface';
import { Url } from '../url';
import { DeleteResult, EntityManager } from 'typeorm';

export interface IUserUrlRepository {
  save: (dto: CreateUserUrlDto, manager: EntityManager) => Promise<Url>;
  update: (dto: UpdateUserUrlDto, manager: EntityManager) => Promise<void>;
  // findOne: (dto: FindOneUserUrlDto) => Promise<UserUrl>;
  findOneWithUser: (dto: FindOneUserUrlWithUserDto) => Promise<Url>;
  // findOneWithUrl(
  //   dto: FindOneUserWithUrlDto,
  //   manager: EntityManager,
  // ): Promise<boolean>;
  delete(id: number, manager: EntityManager): Promise<DeleteResult>;
}
