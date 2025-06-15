import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, UploadedFile, Res } from '@nestjs/common';
import { Response } from 'express';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Authorized } from 'src/common/guards/auth.guards';
import { Roles } from 'src/common/decorators/role-decorator';
import { Role } from 'src/common/enums/roles.enum';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { DeleteVehicleDto } from './dto/delete-vehicle.dto';
import { CreateStyleDto } from './dto/create-style.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { DeleteSystemDto } from './dto/delete-system.dto';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { createReadStream } from 'fs';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Roles(Role.machinery_insert)
  @UseGuards(Authorized)
  @Post()
  create(
    @Body()
    createVehicleDto: CreateVehicleDto,
  ) {
    return this.vehicleService.create(
      createVehicleDto
    );
  }

  @Patch(':id')
  @Roles(Role.machinery_edit)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'vehicleCard', maxCount: 1 },
    { name: 'vehicleGreenCard', maxCount: 1 },
    { name: 'ownDoc', maxCount: 1 },
  ]))
  update(
    @Param('id') id: string,
    @Body() body: UpdateVehicleDto,
    @UploadedFiles()
    files: Express.Multer.File[]
  ) {

    return this.vehicleService.update(+id, body,
      files['vehicleCard'] != null ? files['vehicleCard'][0].filename : null,
      files['vehicleGreenCard'] != null ? files['vehicleGreenCard'][0].filename : null,
      files['ownDoc'] != null ? files['ownDoc'][0].filename : null
      );
  }

  @Delete()
  @Roles(Role.machinery_delete)
  @UseGuards(Authorized)
  async delete(
    @Body() body: DeleteVehicleDto
  ) {
    const deletedItems: number = await this.vehicleService.delete(body);

    return {
      deletedItems: deletedItems
    }
  }

  @Get('/advance-search')
  @UseGuards(Authorized)
  async vehiclesOfContract(
    @Query() params: any
  ) {
    const result: IResponseWithBuffer = await this.vehicleService.getVehiclesOfContract(params);
    return result.list;
  }

  @Get('/advance-search/excel')
  async vehiclesOfContractExcel(
    @Query() params: any,
    @Res() response: Response
  ) {
    const result: IResponseWithBuffer = await this.vehicleService.getVehiclesOfContract(params);
    const buffer: Buffer = result.buffer;
    response.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', 'attachment;filename=vehicles_list.xlsx');
    response.end(buffer);
  }

  @Get('/types')
  @UseGuards(Authorized)
  findAllType() {
    return this.vehicleService.findAllTypes();
  }

  @Get('systems/:typeId')
  @UseGuards(Authorized)
  findAllSystems(
    @Param('typeId') typeId: string
  ) {
    return this.vehicleService.allSystems(+typeId);
  }

  @Get('systems')
  @UseGuards(Authorized)
  getAllSystems() {
    return this.vehicleService.getAllSystems();
  }

  @Get('styles')
  @UseGuards(Authorized)
  getAllStyles() {
    return this.vehicleService.getAllStyles();
  }

  @Get('types')
  @UseGuards(Authorized)
  async getAllTypes(){
    console.log('get all types');
    return await this.vehicleService.getAllTypes();
  }

  @Get('styles/:systemId')
  @UseGuards(Authorized)
  findAllStyles(
    @Param('systemId') systemId: string
  ) {
    return this.vehicleService.allStyles(+systemId);
  }

  @Get('/find')
  @UseGuards(Authorized)
  async findWithSearch(@Query() params: any) {
    return await this.vehicleService.findAllWithSearch(params);
  }


  @Get('/:id')
  @UseGuards(Authorized)
  fineOne(
    @Param('id') id: string
  ) {
    return this.vehicleService.findOne(+id);
  }


  @Post('system')
  @UseGuards(Authorized)
  @UseInterceptors(FileInterceptor('logo'))
  async addSystem(
    @Body() body: CreateSystemDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    const fileName: string = logo !== undefined ? logo.filename : null;

    return this.vehicleService.createSystem(body, fileName);
  }

  @Patch('system/:id')
  @UseGuards(Authorized)
  @UseInterceptors(FileInterceptor('logo'))
  async updateSystem(
    @Body() body: UpdateSystemDto,
    @UploadedFile() logo: Express.Multer.File,
    @Param('id') id: string
  ) {
    return this.vehicleService.updateSystem(
      body,
      logo != null ? logo.filename : null,
      +id
    );
  }

  @Delete('system')
  @UseGuards(Authorized)
  async deleteSystem(
    @Body() body: DeleteSystemDto
  ) {
    const deletedItems: number = await this.vehicleService.deleteSystem(body);

    return {
      deletedItems: deletedItems
    };
  }

  @Post('style')
  @UseGuards(Authorized)
  createStyle(
    @Body() body: CreateStyleDto
  ) {
    return this.vehicleService.createStyle(body);
  }

  @Patch('style/:id')
  @UseGuards(Authorized)
  updateStyle(
    @Body() body: UpdateStyleDto,
    @Param('id') id: string
  ) {
    return this.vehicleService.updateStyle(body, +id);
  }

  @Delete('style')
  @UseGuards(Authorized)
  async deleteStyle(
    @Body() body: DeleteSystemDto
  ) {
    const count: number = await this.vehicleService.deleteStyle(body);
    return {
      'deletedItems': count
    };
  }

  @Post('type')
  @UseGuards(Authorized)
  createType(
    @Body() body: CreateTypeDto
  ) {
    return this.vehicleService.createType(body);
  }

  @Patch('type/:id')
  @UseGuards(Authorized)
  updateType(
    @Body() body: UpdateTypeDto,
    @Param('id') id: string
  ) {
    return this.vehicleService.updateType(+id, body);
  }

  @Delete('type')
  @UseGuards(Authorized)
  async deleteType(
    @Body() body: DeleteSystemDto
  ) {
    const deletedItems: number = await this.vehicleService.deleteType(body);

    return {
      deletedItems: deletedItems
    };
  }
}
