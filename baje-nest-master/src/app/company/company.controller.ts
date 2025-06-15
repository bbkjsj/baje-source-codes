import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles, Put
} from "@nestjs/common";
import { Authorized } from 'src/common/guards/auth.guards';
import { CompanyService } from './company.service';
import { CreateBoardMemberDTO } from './dto/create-board-member.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateBoardMemberDTO } from './dto/update-board-member.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CompanyResponse } from "./responses";
import { DeleteCompanyDto } from "./dto/delete-company.dto";

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(Authorized)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'sign', maxCount: 1 },
    { name: 'seal', maxCount: 1 }
  ]))
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<void> {
    return await this.companyService.createCompany({
      request: createCompanyDto,
      files: files
    });
  }

  @Put(':id')
  @UseGuards(Authorized)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'sign', maxCount: 1 },
    { name: 'seal', maxCount: 1 }
  ]))
  async updateCompany(
    @Body() request: UpdateCompanyDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
  ): Promise<void> {
    await this.companyService.updateCompany({
      id: +id,
      request: request,
      files: files
    });
  }

  @Delete()
  async deleteCompany(
    @Body() request: DeleteCompanyDto
  ): Promise<void> {
    return this.companyService.deleteCompanies(request);
  }

  @Post('/board-members')
  @UseGuards(Authorized)
  addBoardMember(@Body() body: CreateBoardMemberDTO) {
    return this.companyService.createBoardMember(body);
  }

  @Patch('/board-members/:id')
  @UseGuards(Authorized)
  updateBoardMember(@Body() body: UpdateBoardMemberDTO, @Param('id') id:string) {
    return this.companyService.updateBoardMember(+id, body);
  }


  @Get()
  @UseGuards(Authorized)
  async getCompanies() {
    return this.companyService.listOfCompanies();
  }

  @Get(':id')
  @UseGuards(Authorized)
  async getCompanyDetail(
    @Param('id') id: string
  ) {
    return this.companyService.getCompanyDetail({
      id: +id
    });
  }

  @Get('/board-members/by-company/:company_id')
  @UseGuards(Authorized)
  findBoardMembers(@Param('company_id') id:string) {
    return this.companyService.findBoardMembers(+id);
  }

  @Get('/board-members/by-id/:id')
  @UseGuards(Authorized)
  async findBoardMembersById(@Param('id') id: string) {
    return await this.companyService.boardMemberDetail(+id);
  }

  @Get('/board-members/by-person/:id')
  @UseGuards(Authorized)
  findBoardMembersByPerson(@Param('id') id:string) {
    return this.companyService.boardMemberByPersonnelId(+id);
  }

  @Delete('/board-members/:id')
  @UseGuards(Authorized)
  deleteBoardMember(@Param('id') id:string) {
    return this.companyService.deleteBoardMember(+id);
  }
}
