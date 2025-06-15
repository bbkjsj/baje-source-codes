import { Test, TestingModule } from '@nestjs/testing';
import { TableNameController } from './table-name.controller';
import { TableNameService } from './table-name.service';

describe('TableNameController', () => {
  let controller: TableNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableNameController],
      providers: [TableNameService],
    }).compile();

    controller = module.get<TableNameController>(TableNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
