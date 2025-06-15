import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, Res, Delete, Req } from "@nestjs/common";
import { Roles } from "src/common/decorators/role-decorator";
import { Role } from "src/common/enums/roles.enum";
import { Authorized } from "src/common/guards/auth.guards";
import { ContractService } from "./contract.service";
import { CreateContractDTO } from "./dtos/create.dto";
import { ContractUpdateStatusDTO } from './dtos/update-status.dto';
import { UpdateContractDTO } from "./dtos/update.dto";
import { Response, Request } from 'express';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { DeleteContractDto } from './dtos/delete-contract.dto';

@Controller('contract')
export class ContractController {
    constructor(private readonly service: ContractService){}


    @Post()
    @Roles(Role.contract_insert)
    @UseGuards(Authorized)
    async createContract(@Body() body: CreateContractDTO) {
        return await this.service.create(body);
    }

    @Put(':id')
    @Roles(Role.contract_edit, Role.contract_insert)
    @UseGuards(Authorized)
    async updateContract(@Param('id') id:string, @Body() body:UpdateContractDTO) {
        return await this.service.update(Number(id), body);
    }

    @Get('excel/:type')
  async vehiclesOfContractExcel(
    @Query() params: any,
    @Res() response: Response,
    @Param('type') type: string,
  ) {
    const result: IResponseWithBuffer = await this.service.getList(type, params, null);
    const buffer: Buffer = result.buffer;
    response.setHeader("Content-Type", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', 'attachment;filename=vehicles_list.xlsx');
    response.end(buffer);
  }


    @Get('list/:type')
    @Roles(Role.contract_list, Role.contract_edit)
    @UseGuards(Authorized)
    async getList(
        @Param('type') type: string,
        @Query() params: any,
        @Req() request: Request,
    ) {

        const result = await  this.service.getList(type, params, request.user);
        return result.list;
    }


    @Get('peyman-report/:contractId')
    @Roles(Role.contract_list, Role.contract_edit)
    @UseGuards(Authorized)
    async getPeymanReportOfContract(
        @Param('contractId') contractId: string
    ) {

    }

    @Get(':id')
    @Roles(Role.contract_list, Role.contract_edit)
    @UseGuards(Authorized)
    async getItemDetails(
        @Param('id') id: string
    ) {
        return this.service.getOneItem(+id);
    }

    @Put(':id/status')
    @Roles(Role.contract_edit)
    @UseGuards(Authorized)
    async updateContractStatus(
        @Param('id') id: string,
        @Body() body: ContractUpdateStatusDTO
    ) {
        return this.service.updateStatus(+id, body);
    }

    @Delete()
    @Roles(Role.contract_delete)
    @UseGuards(Authorized)
    async deleteContracts(
        @Body() body: DeleteContractDto
    ) {
        return this.service.deleteContracts(body.ids);
    }


}