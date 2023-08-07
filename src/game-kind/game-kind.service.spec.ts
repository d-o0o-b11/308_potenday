import { Test, TestingModule } from '@nestjs/testing';
import { GameKindService } from './game-kind.service';

describe('GameKindService', () => {
  let service: GameKindService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameKindService],
    }).compile();

    service = module.get<GameKindService>(GameKindService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
