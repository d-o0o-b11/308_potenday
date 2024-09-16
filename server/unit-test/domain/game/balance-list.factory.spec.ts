import { ReconstituteBalanceListDto } from '@application';
import { BalanceList, BalanceListFactory } from '@domain';
import { Test, TestingModule } from '@nestjs/testing';

describe('BalanceListFactory', () => {
  let factory: BalanceListFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceListFactory],
    }).compile();

    factory = module.get<BalanceListFactory>(BalanceListFactory);
  });

  it('IsDefined', () => {
    expect(factory).toBeDefined();
  });

  describe('reconstitute', () => {
    it('BalanceList객체를 반환합니다.', () => {
      const id = 1;
      const typeA = 'Option A';
      const typeB = 'Option B';

      const result = factory.reconstitute(
        new ReconstituteBalanceListDto(id, typeA, typeB),
      );

      expect(result).toBeInstanceOf(BalanceList);

      expect(result.getId()).toBe(id);
      expect(result.getTypeA()).toBe(typeA);
      expect(result.getTypeB()).toBe(typeB);
    });
  });
});
