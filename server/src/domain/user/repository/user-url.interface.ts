import {
  CreateUserUrlDto,
  FindOneUserUrlDto,
  FindOneUserUrlWithUserDto,
  FindOneUserWithUrlDto,
  UpdateUserUrlDto,
} from '@interface';
import { UserUrl } from '../user-url';

export interface IUserUrlRepository {
  save: (dto: CreateUserUrlDto) => Promise<UserUrl>;
  update: (dto: UpdateUserUrlDto) => Promise<void>;
  findOne: (dto: FindOneUserUrlDto) => Promise<UserUrl>;
  findOneWithUser: (dto: FindOneUserUrlWithUserDto) => Promise<UserUrl>;
  findOneWithUrl(dto: FindOneUserWithUrlDto): Promise<boolean>;
}
