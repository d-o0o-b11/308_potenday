import { Test, TestingModule } from '@nestjs/testing';
import { AdjectiveExpressionService } from './service/adjective-expression.service';

describe('AdjectiveExpressionService', () => {
  let service: AdjectiveExpressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdjectiveExpressionService],
    }).compile();

    service = module.get<AdjectiveExpressionService>(
      AdjectiveExpressionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
