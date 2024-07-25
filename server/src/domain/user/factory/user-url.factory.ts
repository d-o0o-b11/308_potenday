import { Injectable } from '@nestjs/common';
import { UserUrl } from '../user-url';
import {
  ReconstituteFactoryDto,
  ReconstituteWithUserFactoryDto,
} from '@interface';

@Injectable()
export class UserUrlFactory {
  reconstitute(dto: ReconstituteFactoryDto): UserUrl {
    return new UserUrl(dto.id, dto.url, dto.status);
  }

  reconstituteWithUser(dto: ReconstituteWithUserFactoryDto): UserUrl {
    return new UserUrl(dto.id, dto.url, dto.status, dto.users);
  }
}
