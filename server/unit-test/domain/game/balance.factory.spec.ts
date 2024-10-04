import {
  ReconstituteBalanceArrayDto,
  ReconstituteBalanceDto,
} from '@application';
import { BALANCE_TYPES, BalanceFactory, UserBalance } from '@domain';
import { Test, TestingModule } from '@nestjs/testing';

describe('BalanceFactory', () => {
  let factory: BalanceFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceFactory],
    }).compile();

    factory = module.get<BalanceFactory>(BalanceFactory);
  });

  it('IsDefined', () => {
    expect(factory).toBeDefined();
  });

  describe('reconstituteArray', () => {
    it('UserBalance 객체를 반환합니다. (with balanceGame)', () => {
      const id = 1;
      const userId = 100;
      const name = 'JohnDoe';
      const imgId = 200;
      const balanceId = 300;
      const balanceType = BALANCE_TYPES.A;
      const balanceGame = { typeA: 'Option A', typeB: 'Option B' };

      const result = factory.reconstituteArray(
        new ReconstituteBalanceArrayDto(
          id,
          userId,
          name,
          imgId,
          balanceId,
          balanceType,
          balanceGame,
        ),
      );

      expect(result).toBeInstanceOf(UserBalance);
      expect(result.getId()).toBe(id);
      expect(result.getUserId()).toBe(userId);
      expect(result.getName()).toBe(name);
      expect(result.getImgId()).toBe(imgId);
      expect(result.getBalanceId()).toBe(balanceId);
      expect(result.getBalanceType()).toBe(balanceType);
      expect(result.getBalanceGame()).toEqual(balanceGame);
    });

    it('UserBalance 객체를 반환합니다. (without balanceGame)', () => {
      const id = 2;
      const userId = 101;
      const name = 'JaneDoe';
      const imgId = 201;
      const balanceId = 301;
      const balanceType = BALANCE_TYPES.B;

      const result = factory.reconstituteArray(
        new ReconstituteBalanceArrayDto(
          id,
          userId,
          name,
          imgId,
          balanceId,
          balanceType,
        ),
      );

      expect(result).toBeInstanceOf(UserBalance);
      expect(result.getId()).toBe(id);
      expect(result.getUserId()).toBe(userId);
      expect(result.getName()).toBe(name);
      expect(result.getImgId()).toBe(imgId);
      expect(result.getBalanceId()).toBe(balanceId);
      expect(result.getBalanceType()).toBe(balanceType);
      expect(result.getBalanceGame()).toBeUndefined();
    });
  });

  describe('reconstitute', () => {
    it('UserBalance 객체를 반환합니다.', () => {
      const id = 3;
      const userId = 102;
      const balanceId = 302;
      const balanceType = BALANCE_TYPES.A;
      const createdAt = new Date();

      const result = factory.reconstitute(
        new ReconstituteBalanceDto(
          id,
          userId,
          balanceId,
          balanceType,
          createdAt,
        ),
      );

      expect(result).toBeInstanceOf(UserBalance);
      expect(result.getId()).toBe(id);
      expect(result.getUserId()).toBe(userId);
      expect(result.getBalanceId()).toBe(balanceId);
      expect(result.getBalanceType()).toBe(balanceType);
      expect(result.getCreatedAt()).toBe(createdAt);
      expect(result.getName()).toBeUndefined();
      expect(result.getImgId()).toBeUndefined();
      expect(result.getBalanceGame()).toBeUndefined();
    });
  });
});
