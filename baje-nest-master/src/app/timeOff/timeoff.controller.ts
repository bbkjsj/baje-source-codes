import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Authorized } from "src/common/guards/auth.guards";
import { CreateTimeOffDTO } from "./dtos/create-timeoff.dto";
import { TimeOffService } from "./timeoff.service";
import { Request  } from "express";
import { DeleteTimeOffDTO } from "./dtos/delete-timeoff.dto";

@Controller('time-off')
@UseGuards(Authorized)
export class TimeOffController {
    constructor(private readonly service: TimeOffService) { }


    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
      @Body() body: CreateTimeOffDTO,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request
      ) {
        let _file = null;
        if(file) {
            _file = file.filename;
        }
        return await this.service.create(body, _file, req.user.id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: string, @Body() body: any, @Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        let _file = null;
        if(file) {
            _file = file.filename;
        }
        return await this.service.update(Number(id), req.user.id, body, _file);
    }

    @Put('/status/:id')
    async updateStatus(@Param('id') id: string, @Body() body: any) {
        if(!body.status) {
            throw new HttpException('status could not be found', 400);
        }
        return await this.service.updateStatus(Number(id), body.status);
    }


    @Delete()
    async deleteMany(@Body() body: DeleteTimeOffDTO, @Req() req: Request) {
        return await this.service.deleteMany(body, req.user);
    }

    @Get(':id')
    async detail(@Param('id') id: string, @Req() req: Request) {
        return await this.service.detail(Number(id), req.user.id);
    }

    @Get()
    async list(@Req() req:Request) {
        return await this.service.list(req.user);
    }
}
