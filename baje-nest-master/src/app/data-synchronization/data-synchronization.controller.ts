import { Controller, Get, Post, Req } from "@nestjs/common";
import { DataSynchronizationService } from "./data-synchronization.service";

@Controller({ path: 'sync'})
export class DataSynchronizationController {

  constructor(
    private readonly service: DataSynchronizationService,
  ) {
  }


  @Get('time')
  async getServerDateTime(): Promise<string> {
    return this.service.getDateTime();
  }

}