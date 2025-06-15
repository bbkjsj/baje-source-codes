import { Test, TestingModule } from '@nestjs/testing';
import { TableNameService } from './table-name.service';

describe('TableNameService', () => {
  let service: TableNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableNameService],
    }).compile();

    service = module.get<TableNameService>(TableNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
