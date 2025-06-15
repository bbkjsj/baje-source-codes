import { Test, TestingModule } from '@nestjs/testing';
import { HseService } from './hse.service';

describe('HseService', () => {
  let service: HseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HseService],
    }).compile();

    service = module.get<HseService>(HseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
