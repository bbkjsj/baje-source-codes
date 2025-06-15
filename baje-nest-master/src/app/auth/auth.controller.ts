import { Body, Controller, Get, NotImplementedException, Post, Req, UseGuards } from '@nestjs/common';
import { Authorized } from 'src/common/guards/auth.guards';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { IdentifyByNationalCodeRequest } from './dtos/identify-by-national-code.dto';
import { IIdentifyPersonnelByNationalNumber } from './interfaces/identify-person-by-national-code.interface';

@Controller({ path: 'auth'})
export class AuthController {

  constructor(
    private readonly service: AuthService
  ) {}

  @Get('who-am-i')
  @UseGuards(Authorized)
  async whoAmI(
    @Req() requestContext: Request
  ) {
    return this.service.whoAmI(
      requestContext.user.id
    );
  }

  @Post('identify-by-national-code')
  async identifyByNationalNumber(
    @Body() request: IdentifyByNationalCodeRequest
  ): Promise<IIdentifyPersonnelByNationalNumber> {
    return this.service.identifyByNationalCode(request.nationalNumber);
  }
}