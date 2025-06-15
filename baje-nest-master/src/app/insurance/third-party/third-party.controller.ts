import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Authorized } from 'src/common/guards/auth.guards';
import { CreateThirdPartyInsuranceDto } from './dtos/create-third-party-insurance.dto';
import { UpdateThirdPartyInsuranceDto } from './dtos/update-third-party-insurance.dto';
import { ThirdPartyInsuranceService } from './third-party.service';

@Controller('insurance/third-party')
export class ThirdPartyInsuranceController {

  constructor(
    private readonly service: ThirdPartyInsuranceService,
  ) {}


  @Post()
  @UseGuards(Authorized)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() body: CreateThirdPartyInsuranceDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let fileName: string = null;
    if(file) {
      fileName = file.filename;
    }
    return this.service.create(body, fileName);
  }

  @Patch(':id')
  @UseGuards(Authorized)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Body() body: UpdateThirdPartyInsuranceDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string
  ) {
    let fileName: string = null;

    if(file) {
      fileName = file.filename;
    }

    return this.service.update(
      +id,
      body,
      fileName
    );
  }

  @Get()
  @UseGuards(Authorized)
  getList() {
    return this.service.getAll();
  }

  @Get(':id')
  @UseGuards(Authorized)
  getOne(
    @Param('id') id: string
  ) {
    return this.service.getOneById(+id);
  }

  @Delete(':id')
  @UseGuards(Authorized)
  delete(
    @Param('id') id: string
  ) {
    return this.service.deleteById(+id);
  }
}