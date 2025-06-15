import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { APIRoles } from 'src/common/decorators/api-auth.decorator';
import { APIAuthRole } from 'src/common/enums/api-auth-role-type.enum';
import { APIAuthorization } from 'src/common/guards/api-auth.guards';
import { OnlineShopService } from './online-shop.service';
import { ValidatePersonnelRequest } from './requests/validate-person.request';
import { IPersonnelDetailResponse } from './responses/personnel-detail.response';
import { IValidatePersonByNationalCode } from './responses/validate-person.response';

@Controller({
  path: 'global/online-shop'
})
export class OnlineShopController {

  constructor(
    private readonly service: OnlineShopService
  ) {}


  @Post('personnel/validate')
  @APIRoles(APIAuthRole.ONLINE_SHOP)
  @UseGuards(APIAuthorization)
  async validatePersonnel(
    @Body() request: ValidatePersonnelRequest
  ): Promise<IValidatePersonByNationalCode> {
    return this.service.validatePersonnelByNationalCode(
      request.nationalCode
    );
  }

  @Get('personnel/detail/national-code/:code')
  @APIRoles(APIAuthRole.ONLINE_SHOP)
  @UseGuards(APIAuthorization)
  async getPersonnelDetailByNationalCode(
    @Param('code') code: string
  ): Promise<IPersonnelDetailResponse> {
    return this.service.getPersonnelDetailByNationalCode(
      code
    );
  }
}