import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Authorized } from 'src/common/guards/auth.guards';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post(':personnelId')
  @UseGuards(Authorized)
  async create(@Param('personnelId') id: string, @Body() body: CreatePermissionDto) {
    return await this.permissionService.create(+id, body);
  }

  @Get('list')
  @UseGuards(Authorized)
  getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }


  @Get(':personnelId')
  @UseGuards(Authorized)
  async findAll(@Param('personnelId') id: string) {
    return await this.permissionService.findAll(+id);
  }

  @Patch(':personnelId')
  @UseGuards(Authorized)
  async update(@Param('personnelId') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionService.update(+id, updatePermissionDto);
  }
}
