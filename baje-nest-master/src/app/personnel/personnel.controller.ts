import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import * as moment from "moment";
import { diskStorage } from "multer";
import { extname } from "path";
import { Roles } from "src/common/decorators/role-decorator";
import { Role } from "src/common/enums/roles.enum";
import { Authorized } from "src/common/guards/auth.guards";
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { CreatePersonDTO } from "./dtos/create-person.dto";
import { CreatePersonnelJobDTO } from "./dtos/create-personnel-job.dto";
import { CreatePersonnelShiftDTO } from "./dtos/create-personnel-shift.dto";
import { CreateSubordinateDTO } from './dtos/create-subordinate.dto';
import { DeletePersonnelManyDTO } from "./dtos/delete-many.dto";
import { ImportDBFDTO } from "./dtos/import-dbf.dto";
import { UpdatePersonDTO } from "./dtos/update-person.dto";
import { UpdatePersonnelAccessDTO } from "./dtos/update-personnel-access.dto";
import { UpdatePersonnelJobDTO } from "./dtos/update-personnel-job.dto";
import { ValidateNationalCodeDTO } from './dtos/validate-national-code.dto';
import { PersonnelService } from "./personnel.service";
import { PersonnelAvailabilityRequest } from "./dtos/personnel-availability.dto";
import { PersonnelAvailabilityResponse } from "./interfaces/personnel-availability.interface";


@Controller('personnel')
export class PersonnelController {

    constructor(private service: PersonnelService) { }

    //old: /api/admin/personnel/person
    @Roles(Role.person_insert)
    @UseGuards(Authorized)
    @Post()
    async createPersonnel(@Body() body: CreatePersonDTO) {
        return await this.service.insertPersonn(
            body
        );
    }



    //old: /api/admin/personnel/edit
    @Put('/:id')
    @Roles(Role.person_edit, Role.person_insert)
    @UseGuards(Authorized)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'national_card_front', maxCount: 1 },
        { name: 'national_card_rear', maxCount: 1 },
        { name: 'birth_certificate', maxCount: 1 },
        { name: 'army_service_card', maxCount: 1 },
        { name: 'person', maxCount: 1 },
        { name: 'sign', maxCount: 1 }
    ]))
    async updatePersonnel(@Body() body: UpdatePersonDTO, @Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
        return await this.service.updatePerson(Number(id), files['national_card_front'] != null ? files['national_card_front'][0].filename : null,
            files['national_card_rear'] != null ? files['national_card_rear'][0].filename : null,
            files['birth_certificate'] != null ? files['birth_certificate'][0].filename : null,
            files['army_service_card'] != null ? files['army_service_card'][0].filename : null,
            files['person'] != null ? files['person'][0].filename : null,
            files['sign'] != null ? files['sign'][0].filename : null, body, req.user);
    }

    @Get('/subordinates/:id')
    @UseGuards(Authorized)
    async getPersonnelSubordinates(@Param('id') id: string) {
        return await this.service.getPersonnelSubordinates(Number(id));
    }

    @Put('/subordinates/:id')
    @UseGuards(Authorized)
    async updateSubordinate(@Param('id') id: string, @Body() body) {
        return await this.service.updateSubordinate(+id, body);
    }

    @Post('subordinates/:personnelId')
    @UseGuards(Authorized)
    async addSubordinateToPersonnel(
        @Param('personnelId') personnelId: string,
        @Body() body: CreateSubordinateDTO
    ) {
        return this.service.addSubordinateToPersonnel({
            personnelId: +personnelId,
            dto: body
        });
    }

    @Delete('/subordinates/:id')
    @UseGuards(Authorized)
    async deleteSubordinate(@Param('id') id: string) {
        return await this.service.deleteSubordinate(Number(id));
    }

    @Put('/permission/:personnelId')
    @UseGuards(Authorized)
    async updatePersonnelPermission(@Param('personnelId') id: string, @Body() body: UpdatePersonnelAccessDTO) {
        return await this.service.updatePersonnelPermission(Number(id), body);
    }


    @Get('/list/:companyId/:contractId')
    // @Roles(Role.person_list)
    @UseGuards(Authorized)
    async listOfPersonnelOfCompanyContract(
        @Param('companyId') companyId: string,
        @Param('contractId') contractId: string,
        @Req() req: Request,
        @Query() params: any) {
        return this.service.personnelOfCompanyContract(req.user, Number(companyId), Number(contractId), params);
    }


    @Get('excel/list/:companyId/:contractId')
    @UseGuards(Authorized)
    async excelListPersonnelOfCompanyWithContract(
        @Param('companyId') companyId: string,
        @Param('contractId') contractId: string,
        @Query() params: any,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const result: IResponseWithBuffer = await this.service.personnelOfCompanyContractWithBuffer(
            request.user,
            +companyId,
            +contractId,
            params
        );
        const buffer: Buffer = result.buffer;
        response.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Length', buffer.length);
        response.setHeader('Content-Disposition', 'attachment;filename=personnel_contract_company_list.xlsx');
        response.end(buffer);
    }


    @Post('/dbf')
    @UseGuards(Authorized)
    @UseInterceptors(FileInterceptor('dbf_file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads/personnel/dbf')
            },
            filename: (req, file, cb) => {
                cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadDBF(@UploadedFile() file: Express.Multer.File, @Body() body: ImportDBFDTO) {
        return await this.service.importPersonnelFromDBF(file.path, Number(body.company_id), Number(body.contract_id));
    }


    @Post('/excel')
    @UseGuards(Authorized)
    @UseInterceptors(FileInterceptor('excel_file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads/personnel/excel')
            },
            filename: (req, file, cb) => {
                cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadExcel(@UploadedFile() file: Express.Multer.File,
        @Body() body: ImportDBFDTO) {
        console.log('here');
        return await this.service.importPersonnelFromExcel(file.path, Number(body.company_id), Number(body.contract_id));
    }


    @Post('/subordinate/excel')
    @UseGuards(Authorized)
    @UseInterceptors(FileInterceptor('excel_file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads/personnel/excel')
            },
            filename: (req, file, cb) => {
                cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
            }
        })
    }))
    async importSubordinateFromExcel(@UploadedFile() file: Express.Multer.File) {
        return await this.service.importSubordinateFromExcel(file.path);
    }


    @Post('/search')
    async searchPersonnelByName(@Body() body) {
        return await this.service.globalSearch(body.firstName, body.lastName, body.nationalCode, body.insuranceNumber, body.fatherName, body.mobile);
    }

    @Delete('/many')
    @Roles(Role.person_delete)
    @UseGuards(Authorized)
    async deletePersonnels(@Body() body: DeletePersonnelManyDTO) {
        return await this.service.deletePersonnels(body.ids);
    }


    @Delete('/subordinate/many')
    @Roles(Role.person_delete)
    @UseGuards(Authorized)
    async deleteSubordinates(@Body() body: DeletePersonnelManyDTO) {
        return await this.service.deleteSubordinates(body.ids);
    }

    @Post('/shift')
    @UseGuards(Authorized)
    createPersonnelShift(@Body() body: CreatePersonnelShiftDTO) {
        return this.service.createPersonnelShift(body);
    }

    @Post('/jobs')
    @UseGuards(Authorized)
    createPersonnelJob(@Body() body: CreatePersonnelJobDTO) {
        return this.service.createPersonnelJob(body);
    }

    @Patch('/jobs/:id')
    @UseGuards(Authorized)
    updatePersonnelJob(@Param('id') id: string, @Body() body: UpdatePersonnelJobDTO) {
        return this.service.updatePersonnelJob(+id, body);
    }

    @Get('/jobs')
    @UseGuards(Authorized)
    findAllPersonnelJobs(@Query() params: any) {
        return this.service.findAllPersonnelJobList(+params.page, +params.size);
    }

    @Get('/jobs/person/:id')
    @UseGuards(Authorized)
    findOnePersonJob(@Param('id') id: string, @Query() params: any) {
        return this.service.findOnePersonJobs(+id, +params.page, +params.size);
    }


    @Get('/jobs/:id')
    @UseGuards(Authorized)
    findPersonnelJob(@Param('id') id: string) {
        return this.service.personnelJobDetail(+id);
    }

    @Delete('/jobs/:id')
    @UseGuards(Authorized)
    deletePersonnelJob(@Param('id') id: string) {
        return this.service.deletePresonnelJob(+id);
    }

    @Patch('/:id')
    @UseGuards(Authorized)
    updateContactInfo(@Param('id') id: string, @Body() body: UpdatePersonDTO) {
        return this.service.updatePersonnel(+id, body);
    }

    @Patch('/document/:id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'army_service_card', maxCount: 1 },
        { name: 'birth_certificate', maxCount: 1 },
        { name: 'national_card_front', maxCount: 1 },
        { name: 'national_card_rear', maxCount: 1 },
        { name: 'person_img', maxCount: 1 },
        { name: 'sign', maxCount: 1 },
        { name: 'latest_educational_document', maxCount: 1 }
    ]))
    @UseGuards(Authorized)
    async updateDocuments(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
        const dto: any = {};
        if (files['army_service_card'] != null) {
            dto['army_service_card_url'] = files['army_service_card'][0].filename;
        }
        if (files['birth_certificate'] != null) {
            dto['birth_certificate_url'] = files['birth_certificate'][0].filename;
        }
        if (files['national_card_front'] != null) {
            dto['national_card_front_url'] = files['national_card_front'][0].filename;
        }
        if (files['national_card_rear'] != null) {
            dto['national_card_rear_url'] = files['national_card_rear'][0].filename;
        }
        if (files['person_img'] != null) {
            dto['image_url'] = files['person_img'][0].filename;
        }
        if (files['sign'] != null) {
            dto['sign_url'] = files['sign'][0].filename;
        }
        if (files['latest_educational_document'] != null) {
            dto['latest_educational_document_url'] = files['latest_educational_document'][0].filename;
        }
        return await this.service.updateDocuments(dto, +id);
    }

    @Get(':id')
    @UseGuards(Authorized)
    personnelDetail(@Param('id') id: string) {
        return this.service.findPersonnelById(+id);
    }

    @Post('national-code/validate')
    @UseGuards(Authorized)
    async validateNationalCode(
        @Body() request: ValidateNationalCodeDTO
    ) {
        return this.service.validateNationalCode(
            request.nationalCode
        );
    }

    @Post('availability')
    @UseGuards(Authorized)
    async checkPersonnelAvailability(
      @Body() request: PersonnelAvailabilityRequest
    ): Promise<PersonnelAvailabilityResponse[]> {
        return await this.service.checkPersonnelAvailability(request);
    }
}
