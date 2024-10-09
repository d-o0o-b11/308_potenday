import { Test, TestingModule } from '@nestjs/testing';
import {
  FindUserAdjectiveExpressionReadDto,
  ReconstituteAdjectiveExpressionArrayDto,
  ReconstituteAdjectiveExpressionDto,
} from '@application';
import {
  AdjectiveExpression,
  AdjectiveExpressionFactory,
  ADJECTIVES,
  UserAdjectiveExpression,
  UserRead,
} from '@domain';

describe('AdjectiveExpressionFactory', () => {
  let factory: AdjectiveExpressionFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdjectiveExpressionFactory],
    }).compile();

    factory = module.get<AdjectiveExpressionFactory>(
      AdjectiveExpressionFactory,
    );
  });

  it('IsDefined', () => {
    expect(factory).toBeDefined();
  });

  describe('reconstitute', () => {
    it('AdjectiveExpression 객체를 반환합니다.', () => {
      const id = 1;
      const adjective = ADJECTIVES.꼼꼼한;
      const result = factory.reconstitute(
        new ReconstituteAdjectiveExpressionDto(id, adjective),
      );

      expect(result).toBeInstanceOf(AdjectiveExpression);
      expect(result.getId()).toBe(id);
      expect(result.getAdjective()).toBe(adjective);
    });
  });

  describe('reconstituteUserArray', () => {
    it('UserAdjectiveExpression 객체를 반환합니다.', () => {
      const id = 1;
      const userId = 2;
      const adjectiveExpressionId = 3;
      const createdAt = new Date();

      const result = factory.reconstituteUserArray(
        new ReconstituteAdjectiveExpressionArrayDto(
          id,
          userId,
          adjectiveExpressionId,
          createdAt,
        ),
      );

      expect(result).toBeInstanceOf(UserAdjectiveExpression);
      expect(result.getId()).toBe(id);
      expect(result.getUserId()).toBe(userId);
      expect(result.getAdjectiveExpressionId()).toBe(adjectiveExpressionId);
      expect(result.getCreatedAt()).toBe(createdAt);
    });
  });

  describe('reconstituteAdjectiveExpressionRead', () => {
    it('UserRead 객체를 반환합니다.', () => {
      const dto = {
        userId: 126,
        imgId: 2,
        name: 'd_o0o_b',
        urlId: 111,
        adjectiveExpression: {
          adjectiveExpressionIdList: [1, 11],
          createdAt: '2024-09-15',
        },
      };

      const result = factory.reconstituteAdjectiveExpressionRead(
        new FindUserAdjectiveExpressionReadDto(
          dto.userId,
          dto.imgId,
          dto.name,
          dto.urlId,
          dto.adjectiveExpression,
        ),
      );

      expect(result).toBeInstanceOf(UserRead);
      expect(result.getUserId()).toBe(dto.userId);
      expect(result.getImgId()).toBe(dto.imgId);
      expect(result.getName()).toBe(dto.name);
      expect(result.getUrlId()).toBe(dto.urlId);
      expect(result.getAdjectiveExpressions()).toBe(dto.adjectiveExpression);
      expect(result.getCreatedAt()).toBeInstanceOf(Date);
      expect(result.getUpdatedAt()).toBeInstanceOf(Date);
    });
  });
});
