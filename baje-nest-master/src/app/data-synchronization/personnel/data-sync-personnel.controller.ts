import { Body, Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { IDataSyncPersonnelDetailResponse } from "./responses/data-sync-personnel-detail-response.interface";
import { DataSyncPersonnelService } from "./data-sync-personnel.service";
import { BimehClientApplicationAuthGuards } from "../../../common/guards/bimeh-client-application-auth.guards";
import { Request } from "express";
import { DataSyncPersonnelUpdateRequest } from "./requests/data-sync-personnel-update.request";

@Controller('sync/personnel')
export class DataSyncPersonnelController {

  constructor(
    private readonly service: DataSyncPersonnelService,
  ) {}

  @UseGuards(BimehClientApplicationAuthGuards)
  @Get('/:nationalCode')
  async getPersonnelDetail(
    @Param('nationalCode') nationalCode: string,
  ): Promise<IDataSyncPersonnelDetailResponse> {
    return await this.service.getPersonnelDetail({
      nationalCode: nationalCode
    });
  }

  @UseGuards(BimehClientApplicationAuthGuards)
  @Put()
  async updatePersonnelDetail(
    @Body() request: DataSyncPersonnelUpdateRequest
  ): Promise<void> {
    return this.service.updatePersonnelDetail({
      request: request
    });
  }
}
