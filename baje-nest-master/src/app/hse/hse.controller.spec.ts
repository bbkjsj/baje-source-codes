import { Test, TestingModule } from '@nestjs/testing';
import { HseController } from './hse.controller';
import { HseService } from './hse.service';

describe('HseController', () => {
  let controller: HseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HseController],
      providers: [HseService],
    }).compile();

    controller = module.get<HseController>(HseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
