import { Injectable } from '@nestjs/common';
import { UserMbti } from '../user-mbti';
import { UserMbtiRawDto } from '@interface';

@Injectable()
export class UserMbtiFactory {
  reconstituteArray(
    userId: number,
    mbti: string,
    nickName: string,
    imgId: number,
    toUserId: number,
  ): UserMbti {
    return new UserMbti(undefined, userId, mbti, toUserId, nickName, imgId);
  }

  reconstituteArrayFromRaw(rawMbtis: UserMbtiRawDto[]): UserMbti[] {
    return rawMbtis.map((mbti) =>
      this.reconstituteArray(
        mbti.userId,
        mbti.mbti,
        mbti.nickName,
        mbti.imgId,
        mbti.toUserId,
      ),
    );
  }
}
