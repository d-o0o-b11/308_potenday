import { Test, TestingModule } from '@nestjs/testing';
import { UserUrlService } from './user-url.service';

describe('UserUrlService', () => {
  let service: UserUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUrlService],
    }).compile();

    service = module.get<UserUrlService>(UserUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
