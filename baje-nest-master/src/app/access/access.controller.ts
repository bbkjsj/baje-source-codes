import { Body, Controller, Get, Param, Post, Put, UseGuards, Request, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { Authorized } from 'src/common/guards/auth.guards';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { AccessService } from './access.service';
import { AssignAccessToPersonnelRequest } from './dto/assign-access-to-personnel.dto';
import { CreatePrerequisiteDTO } from './dto/create-prerequisite.dto';
import { DeleteAssignAccessToPersonnel } from './dto/delete-assign-access-to-personnel.dto';
import { UpdateAccessDTO } from './dto/update-access.dto';
import { UpdateAssignAccessToPersonnel } from './dto/update-assign-access-to-personnel.dto';

@Controller('access')
export class AccessController {

  constructor(
    private readonly accessService: AccessService
  ) {}

  @Get()
  @UseGuards(Authorized)
  async getAllAccess() {
    return await this.accessService.getAllAccess();
  }


  @Post('prerequisite')
  @UseGuards(Authorized)
  async addPrerequisiteAccess(
    @Body() body: CreatePrerequisiteDTO,
    @Request() request: Request
  ) {
    return this.accessService.addPrerequisite({
      accessCode: body.accessCode,
      prerequisiteIds: body.prerequisiteIds,
      addPrerequisiteForUsers: body.createPrequisiteForUsers ?? false,
      operatorId: +request['user'].id
    });
  }

  @Get('prerequisite/:accessCode')
  @UseGuards(Authorized)
  async getPrerequisite(
    @Param('accessCode') accessCode: string
  ) {
    return this.accessService.getPrerequisite({
      accessCode: accessCode
    });
  }

  @Get('report/jobs/:jobId')
  @UseGuards(Authorized)
  async getJobAccess(
    @Param('jobId') jobId: string
  ) {
    return this.accessService.getJobAccess({
      jobId: +jobId
    });
  }

  @Get('report/excel/personnel-access/:accessCode')
  async excelReportAccessPersonnel(
    @Param('accessCode') accessCode: string,
    @Res() response: Response,
  ) {
    const result: IResponseWithBuffer = await this.accessService.excelReportAccessOfPersonnels({
      accessCode: accessCode
    });
    const buffer: Buffer = result.buffer;
    response.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', 'attachment;filename=access_personnel_report.xlsx');
    response.end(buffer);
  }

   @Get('report/excel/prerequisite/:accessCode')
   async excelReportGetAccessPrerequisite(
    @Param('accessCode') accessCode: string,
    @Res() response: Response,
   ) {
    const result: IResponseWithBuffer = await this.accessService.excelReportAccessPrerequisite({
      accessCode: accessCode
    });

    const buffer: Buffer = result.buffer;
    response.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', 'attachment;filename=access_personnel_report.xlsx');
    response.end(buffer);
   }

  @Put('status/:code')
  @UseGuards(Authorized)
  async setStatus(
    @Body() request: UpdateAccessDTO,
    @Param('code') code: string
  ) {
    await this.accessService.updateAccess({
      accessCode: +code,
      request: request
    });
  }

  @Post()
  @UseGuards(Authorized)
  async assignAccessToPersonnel(
    @Body() body: AssignAccessToPersonnelRequest,
    @Request() request: Request,
  ) {
    return this.accessService.assignAccessToPersonnel({
      assignedById: +request['user'].id,
      request: body
    });
  }

  @Get('personnel')
  @UseGuards(Authorized)
  async getAllAssignedAccess() {
    return this.accessService.getAllPersonnelAccess();
  }

  @Get('personnel/:personnelId')
  @UseGuards(Authorized)
  async getPersonnelAssignedAccess(
    @Param('personnelId') personnelId: string
  ) {
    return this.accessService.getPersonnelAssignedAccess({
      personnelId: +personnelId
    });
  }

  @Delete('personnel')
  @UseGuards(Authorized)
  async deleteAssignedPersonnelAccess(
    @Request() request: Request,
    @Body() body: DeleteAssignAccessToPersonnel
  ) {
    return this.accessService.deleteAssignedAccessToPersonnel({
      operatorId: +request['user'].id,
      accessId: body.accessId,
      personnelId: body.personnelId
    });
  }

  @Put('personnel/:accessId')
  @UseGuards(Authorized)
  async updateAssignedAccessToPersonnel(
    @Param('accessId') accessId: string,
    @Body() request: UpdateAssignAccessToPersonnel,
  ) {
    return this.accessService.updateAssignedAccess({
      accessId: +accessId,
      request: request
    });
  }
}