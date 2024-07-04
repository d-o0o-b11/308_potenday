import { CreateUserDto, UserResponseDto } from '../../interface';

export interface IUserRepository {
  save: (dto: CreateUserDto) => Promise<UserResponseDto>;
}
