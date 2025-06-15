import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Authorized } from "src/common/guards/auth.guards";
import { CreateMissionDTO } from "./dtos/create-mission.dto";
import { MissionService } from "./mission.service";

@Controller('mission')
export class  MissionController { 

    constructor(private readonly service: MissionService){}


    @Get(':id')
    @UseGuards(Authorized)
    async getDetail(@Param('id') id: string) {
        return await this.service.detail(Number(id));
    }

    @Get()
    @UseGuards(Authorized)
    async getList() { 
        return await this.service.list();
    }

    @Post()
    @UseGuards(Authorized)
    async create(@Body() body: CreateMissionDTO) { 
        return await this.service.create(body);
    }

    @Put(':id')
    @UseGuards(Authorized)
    async update(@Param('id') id:string, @Body() body: CreateMissionDTO) { 
        return await this.service.update(Number(id), body);
    }

    @Delete(':id')
    @UseGuards(Authorized)
    async delete(@Param('id')id:string) {
        return await this.service.delete(Number(id));
    }
}