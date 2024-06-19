import { CountUsersInRoomResponseDto, FindOneUserUrlDto } from '../dto';

export interface IUserUrlService {
  setUrl: () => Promise<string>;
  checkUserLimitForUrl: (dto: FindOneUserUrlDto) => Promise<number>;
  countUsersInRoom: (url: string) => Promise<CountUsersInRoomResponseDto>;
  updateStatusFalse: (url: string) => Promise<void>;
}
