import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Authorized } from 'src/common/guards/auth.guards';
import { CreateJobPermissionDTO } from './dto/create-job-permission.dto';
import { CreateJobTaminCodeDTO } from './dto/create-job-tamincode.dto';
import { CreateJobsShiftDTO } from './dto/create-jobs-shift.dto';
import { UpdateJobsShiftDTO } from './dto/update-jobs-shift.dto';
import { JobTitleDTO } from './dto/job-title.dto';
import { CreateJobChartDTO } from './dto/create-job-chart.dto';
import { UpdateJobChartDTO } from './dto/update-job-chart.dto';
import { UpdateJobChartNodeDTO } from './dto/update-job-chart-node.dto';
import { CreateJobChartNodeDTO } from './dto/create-job-chart-node.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(Authorized)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll(@Query() params: any) {
    return this.jobsService.findAll(params);
  }

  @Get('/shift')
  @UseGuards(Authorized)
  findShifts() {
    return this.jobsService.findAllShifts();
  }

  @Get('/:jobId/in-company-chart')
  @UseGuards(Authorized)
  findJobsInCompanyChart(@Param('jobId')id:string) {
    return this.jobsService.findJobInCompanyChart(+id);
  }


  @Get('/chart/:id')
  @UseGuards(Authorized)
  detailOfChart(@Param('id')id:string) {
    return this.jobsService.chartDetail(+id);
  }

  @Get('/chart')
  @UseGuards(Authorized)
  listOfCharts() {
    return this.jobsService.listOfCharts();
  }


  @Get(':id')
  @UseGuards(Authorized)
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(Authorized)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(Authorized)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }

  @Post('/permission')
  @UseGuards(Authorized)
  createJobPermission(@Body() body: CreateJobPermissionDTO) {
    return this.jobsService.createPermission(body);
  }

  @Get('permission/by-code/:code')
  @UseGuards(Authorized)
  getPermissionOfJobByCode(
    @Param('code') code: string
  ) {
    return this.jobsService.getJobsByAccessCode(code);
  }

  @Get('/permission/:id')
  @UseGuards(Authorized)
  listJobsPermissions(@Param('id') id: string) {
    return this.jobsService.findPermissions(+id);
  }

  @Post('/tamin')
  @UseGuards(Authorized)
  createJobTaminCode(@Body() body: CreateJobTaminCodeDTO) {
    return this.jobsService.createJobTaminCode(body);
  }

  @Get('/tamin/:id')
  @UseGuards(Authorized)
  findJobTaminCode(@Param('id') id:string) {
    return this.jobsService.findTaminCodes(+id);
  }

  @Post('/shift')
  @UseGuards(Authorized)
  createJobShift(@Body() body: CreateJobsShiftDTO) {
    return this.jobsService.createJobsShift(body);
  }

  @Patch('/shift/:id')
  @UseGuards(Authorized)
  updateJobShift(@Param('id') id:string, @Body() body: UpdateJobsShiftDTO) {
    return this.jobsService.updateJobShift(+id, body);
  }

  @Delete('/shift/:id')
  @UseGuards(Authorized)
  deleteJobShift(@Param('id') id:string) {
    return this.jobsService.deleteJobShift(+id);
  }

  @Get('/shift/detail/:id')
  @UseGuards(Authorized)
  findShiftDetail(@Param('id') id:string) {
    return this.jobsService.shiftDetails(+id);
  }

  @Get('/shift/personnel/:id')
  @UseGuards(Authorized)
  findPersonnelShift(@Param('id') id:string) {
    return this.jobsService.findPersonnelShift(+id);
  }

  @Get('/shift/copy/from/:id')
  @UseGuards(Authorized)
  regenerateFromAnExistingChart(@Param('id') id: string) {
    return this.jobsService.regenerateFromExistingChart(+id);
  }

  @Post('/title')
  @UseGuards(Authorized)
  jobTitle(@Body() body:JobTitleDTO)  {
    return this.jobsService.jobTitle(body);
  }


  @Post('/chart')
  @UseGuards(Authorized)
  createJobChart(@Body() dto: CreateJobChartDTO) {
    return this.jobsService.createJobChart(dto);
  }

  @Patch('/chart/node/:id')
  @UseGuards(Authorized)
  updateJobChartNode(@Param('id')id: string, @Body() body: UpdateJobChartNodeDTO) {
    return this.jobsService.updateJobChartNode(+id, body);
  }

  @Patch('/chart/:id')
  @UseGuards(Authorized)
  updateJobChart(@Param('id')id:string, @Body() body: UpdateJobChartDTO) {
    return this.jobsService.updateJobChart(+id, body);
  }

  @Delete('/chart/:id')
  @UseGuards(Authorized)
  deleteChart(@Param('id') id:string) {
    return this.jobsService.deleteChart(+id);
  }

  @Delete('/chart/node/:id')
  @UseGuards(Authorized)
  deleteChartNode(@Param('id') id:string) {
    return this.jobsService.deleteNodeChart(+id);
  }


  @Patch('/chart/node/add-child/:nodeId')
  @UseGuards(Authorized)
  addChildToNode(@Param('nodeId')nid:string, @Body() body:CreateJobChartNodeDTO) {
    return this.jobsService.addChildToNode(+nid, body);
  }

}
