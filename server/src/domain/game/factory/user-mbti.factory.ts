import { Injectable } from '@nestjs/common';
import { UserMbti } from '../user-mbti';
import { UserMbtiRawDto } from '@application';

@Injectable()
export class UserMbtiFactory {
  reconstitute(raw: UserMbtiRawDto): UserMbti {
    return new UserMbti(
      raw.id,
      raw.userId,
      raw.mbti,
      raw.toUserId,
      raw.nickName,
      raw.imgId,
    );
  }
}
