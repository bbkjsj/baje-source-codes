import { Controller, Get } from '@nestjs/common';

@Controller('insurance')
export class InsuranceController {

  constructor() {}

  @Get()
  async getInfo() {
    return 'in progress';
  }
}