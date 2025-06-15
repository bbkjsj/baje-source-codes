import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Authorized } from 'src/common/guards/auth.guards';
import { CreateEnvironmentDTO } from './dtos/create-environment.dto';
import { AddEnvironmentUsageDTO } from './dtos/environment-usage.dto';
import { UpdateEnvironmentUsageDTO } from './dtos/update-environment-usage.dto';
import { UpdateEnvironmentDTO } from './dtos/update-environment.dto';
import { EnvironmentService } from './environment.service';

@Controller('environment')
export class EnvironmentController {

  constructor(
    private readonly service: EnvironmentService,
  ){}



  @Post()
  @UseGuards(Authorized)
  async addEnvironment(
    @Body() request: CreateEnvironmentDTO
  ) {
    return this.service.createEnvironment({
      dto: request
    });
  }

  @Patch(':id')
  @UseGuards(Authorized)
  async updateEnvironment(
    @Body() request: UpdateEnvironmentDTO,
    @Param('id') id: string
  ) {
    return this.service.updateEnvironment({
      dto: request,
      id: +id
    });
  }

  @Delete(':id')
  @UseGuards(Authorized)
  async deleteEnvironment(
    @Param('id') id: string
  ) {
    return this.service.deleteEnvironment({
      id: +id
    });
  }

  @Post('usage')
  @UseGuards(Authorized)
  async addUsage(
    @Body() request: AddEnvironmentUsageDTO
  ) {
    return this.service.addUsage({
      dto: request
    });
  }

  @Patch('usage/:id')
  @UseGuards(Authorized)
  async updateUsage(
    @Param('id') id: string,
    @Body() request: UpdateEnvironmentUsageDTO
  ) {
    return this.service.updateUsage({
      id: +id,
      dto: request
    });
  }

  @Delete('usage/:id')
  @UseGuards(Authorized)
  async deleteUsage(
    @Param('id') id: string
  ) {
    return this.service.deleteUsage({
      id: +id
    });
  }

  @Get('usage/list')
  @UseGuards(Authorized)
  getUsageList() {
    return this.service.getUsages();
  }

  @Get('usage/:id')
  @UseGuards(Authorized)
  getUsageDetail(
    @Param('id') id: string
  ) {
    return this.service.getUsage({
      id: +id
    });
  }

  @Get()
  @UseGuards(Authorized)
  async getListOfEnvironments() {
    return this.service.listEnvironment();
  }

  @Get('/flow/:id')
  @UseGuards(Authorized)
  async environmentFlow(
    @Param('id') id: string
  ) {
    return this.service.environmentFlow(+id);
  }
}