import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Authorized } from 'src/common/guards/auth.guards';
import { CreateFamilyDTO } from '../personnel/dtos/create-family.dto';
import { FamilyCreateDTO } from './dtos/family-create.dto';
import { FamilyDeleteDTO } from './dtos/family-delete.dto';
import { FamilySwapDTO } from './dtos/family-swap.dto';
import { FamilyUpdateDTO } from './dtos/family-update.dto';
import { FamilyService } from './family.service';

@Controller('family')
export class FamilyController {

  constructor(
    private readonly familyService: FamilyService,
  ) {
  }

  @Post()
  // @UseGuards(Authorized)
  async createFamily(
    @Body() body: FamilyCreateDTO
  ) {
    return this.familyService.create({
      personnelNationalId: body.personnelNationalId,
      fatherNationalId: body.fatherNationalId,
      motherNationalId: body.motherNationalId,
      spouseNationalId: body.spouseNationalId,
      brotherNationalId: body.brotherNationalId,
      sisterNationalId: body.sisterNationalId,
      relation: body.relation,
      sameMother: body.sameMother,
      sameFather: body.sameFather,
      syncMother: body.syncMother
    });
  }

  @Get(':nationalNumber')
  async getPersonnelFamily(
    @Param('nationalNumber') nationalNumber: string
  ) {
    return await this.familyService.getPersonFamily(nationalNumber);
  }
  @Post('swap')
  @UseGuards(Authorized)
  async swapFamily(
    @Body() body: FamilySwapDTO
  ) {
    // return this.familyService.swap(body);
  }

  @Put()
  @UseGuards(Authorized)
  async updateFamily(
    @Body() body: FamilyUpdateDTO
  ) {
    // return this.familyService.update(body);
  }

  @Get('brief/:personnelId')
  @UseGuards(Authorized)
  async getOneStepDetals(
    @Param('personnelId') personnelId: string
  ) {
    // return this.familyService.brief(+personnelId);
  }


  @Get(':personnelId')
  @UseGuards(Authorized)
  async familyGenerator(
    @Param('personnelId') personnelId: string,
  ) {

  }



  @Delete(':personnelId')
  @UseGuards(Authorized)
  async deleteFamily(
    @Param('personnelId') personnelId: string
  ) {
    return await this.familyService.deletePersonFromFamily(+personnelId);
  }
}
