import { Global, Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
@Global()
@Module({
  imports: [],
  providers: [
    ExcelService
  ],
  exports: [
    ExcelService
  ]
})
export class ExcelModule {}