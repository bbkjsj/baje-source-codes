import { Body, Controller, Get, Post, UseGuards , Param, Put, Delete} from "@nestjs/common";
import { Authorized } from "src/common/guards/auth.guards";
import { DamageServiceService } from "./damageService.service";
import { CreateDamageServiceDTO } from "./dtos/create.dto";

@Controller('damage-service')
export class DamageServiceController { 
    
    constructor(private readonly service: DamageServiceService){}


    @Post()
    @UseGuards(Authorized)
   async create(@Body() body: CreateDamageServiceDTO){
       return await this.service.create(body);
   }

   @Get(':id')
   @UseGuards(Authorized)
   async detail(@Param('id') id: string) { 
       return await this.service.detail(Number(id));
   }

   @Get('/list/:type/:companyId/:contractId')
   @UseGuards(Authorized)
   async list(@Param('type') type: string, @Param('companyId') companyId: string, @Param('contractId') contractId: string) { 
       return await this.service.list(type, Number(companyId), Number(contractId));
   }

   @Put(':id')
   @UseGuards(Authorized)
   async edit(@Param('id') id: string, @Body() body: CreateDamageServiceDTO) {
       return await this.service.edit(Number(id), body);
   }

   @Delete(':id')
   @UseGuards(Authorized)
   async delete(@Param('id') id:string) { 
       return await this.service.delete(Number(id));
   }
}