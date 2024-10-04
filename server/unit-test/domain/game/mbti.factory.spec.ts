import { UserMbtiRawDto } from '@application';
import { MbtiFactory, UserMbti } from '@domain';
import { Test, TestingModule } from '@nestjs/testing';

describe('MbtiFactory', () => {
  let factory: MbtiFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MbtiFactory],
    }).compile();

    factory = module.get<MbtiFactory>(MbtiFactory);
  });

  it('IsDefined', () => {
    expect(factory).toBeDefined();
  });

  describe('reconstitute', () => {
    it('UserMbti 객체를 반환합니다.', () => {
      const id = 1;
      const userId = 100;
      const name = 'JohnDoe';
      const imgId = 200;
      const mbti = 'ISTJ';
      const toUserId = 127;

      const result = factory.reconstitute(
        new UserMbtiRawDto(id, userId, mbti, toUserId, name, imgId),
      );

      expect(result).toBeInstanceOf(UserMbti);
      expect(result.getId()).toBe(id);
      expect(result.getUserId()).toBe(userId);
      expect(result.getMbti()).toBe(mbti);
      expect(result.getToUserId()).toBe(toUserId);
      expect(result.getName()).toBe(name);
      expect(result.getImgId()).toBe(imgId);
    });
  });
});
