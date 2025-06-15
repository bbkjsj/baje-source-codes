import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySchema } from 'src/app/company/schemas/company.entity';
import { Personnel } from 'src/app/personnel/schemas/personnel.schema';
import { OnlineShopController } from './online-shop.controller';
import { OnlineShopService } from './online-shop.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Personnel,
      CompanySchema,
    ])
  ],
  controllers: [
    OnlineShopController
  ],
  providers: [
    OnlineShopService
  ],
  exports: [
    OnlineShopService
  ]
})
export class OnlineShoppingModule {}