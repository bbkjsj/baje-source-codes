import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import {
  DataSyncAuthorizationService,
  IDataSyncTokenContext
} from "../../app/data-synchronization/shared/data-sync-authorization.service";

@Injectable()
export class BimehClientApplicationAuthGuards implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSyncAuthService: DataSyncAuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token: string = req.headers['authorization']?.toString();

    if(!token) {
      return false;
    }

    const tokenContext: IDataSyncTokenContext =
      await this.dataSyncAuthService.authorize(token);

    if(tokenContext) {
      req.user = {
        companyId: 0, isDoctor: false, isSuper: false,
        id: null,
        name: tokenContext.name
      }
      return true;
    }

    return false;
  }


}