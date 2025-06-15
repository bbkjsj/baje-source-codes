import { Module } from '@nestjs/common';
import { OnlineShoppingModule } from './online-shop/online-shop.module';

@Module({
  imports: [
    OnlineShoppingModule
  ],
  exports: [],
  providers: []
})
export class ApiModile {}