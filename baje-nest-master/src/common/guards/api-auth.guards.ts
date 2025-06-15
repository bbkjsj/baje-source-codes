import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthorizationService } from 'src/shared';
import { APIRoles, API_ROLES_KEY } from '../decorators/api-auth.decorator';
import { APIAuthRole } from '../enums/api-auth-role-type.enum';

@Injectable()
export class APIAuthorization implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token: string = req.headers['api-authorization']?.toString();

    if(!token) {
      throw new UnauthorizedException();
    }

    const requiredRoles:APIAuthRole[] = this.reflector.getAllAndOverride<APIAuthRole[]>(API_ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);


    if(!requiredRoles) {
      throw false;
    }

    for(const role of requiredRoles) {
      if(role === APIAuthRole.ONLINE_SHOP) {
        return await this.authorizationService.onlineShopping({
          token: token
        });
      }
    }

    return true;
  }
}