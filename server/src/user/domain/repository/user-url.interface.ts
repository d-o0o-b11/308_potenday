import {
  CreateUserUrlDto,
  FindOneUserUrlDto,
  FindOneUserUrlWithUserDto,
  UpdateUserUrlDto,
  UserUrlResponseDto,
} from '../../interface';
import { UserUrl } from '../user-url';

export interface IUserUrlRepository {
  save: (dto: CreateUserUrlDto) => Promise<UserUrlResponseDto>;
  update: (dto: UpdateUserUrlDto) => Promise<void>;
  findOne: (dto: FindOneUserUrlDto) => Promise<UserUrl>;
  findOneWithUser: (dto: FindOneUserUrlWithUserDto) => Promise<UserUrl>;
}
