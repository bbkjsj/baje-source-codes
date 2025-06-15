import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Authorized } from 'src/common/guards/auth.guards';
import { IListPaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { IPagination } from 'src/common/interfaces/pagination.interface';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { InsuranceTakmiliService } from './takmili.service';

@Controller('insurance/takmili')
export class InsuranceTakmiliController {

  constructor(
    private readonly insuranceTakmiliService: InsuranceTakmiliService
  ) { }


  @Get('personnel/:insuranceId')
  @UseGuards(Authorized)
  async getInsurancePersonnel(
    @Param('insuranceId') insuranceId: string,
    @Query() params: IPagination,
  ): Promise<IListPaginationResponse> {
    return await this.insuranceTakmiliService.getPersonnelOfInsurance({
      insuranceId: +insuranceId,
      pagination: params
    });
  }

  @Get('personnel/:insuranceId/excel')
  @UseGuards(Authorized)
  async getInsurancePersonnelExcel(
    @Param('insuranceId') insuranceId: string,
    @Res() response: Response
  ) {
    const buffer: Buffer =
      await this.insuranceTakmiliService.getPersonnelOfInsuranceExcelBuffer({
        insuranceId: +insuranceId
      });

    response.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', 'attachment;filename=takmili_personnel.xlsx');
    response.end(buffer);
  }
}