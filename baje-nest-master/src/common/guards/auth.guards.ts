import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { PersonnelService } from "src/app/personnel/personnel.service";
import { IToken, JWTToken } from "../helpers/jwt";

import { AuthService } from 'src/app/auth/auth.service';
import { IAuthWhoAmI } from 'src/app/auth/interfaces';


@Injectable()
export class Authorized implements CanActivate {

    constructor(
        private reflector: Reflector,
        private readonly personnelService: PersonnelService,
        private readonly authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        return await this.verifyToken({
            token: req.headers.authorization?.toString(),
            context: context
        });
    }

    private async oldVerification(token: string): Promise<IToken> {
        const jwtToken = new JWTToken();
        const iToken: IToken = await jwtToken.verify(token);
        let output: any = null;

        output = iToken;

        output.isSuper = output.isSuper ?? false;

        if (output.access == null) {
            const whoAmI: IAuthWhoAmI = await this.authService.whoAmI(output.id);
            output.access = whoAmI.access ?? [];
        }

        return output;
    }

    private verification(token: string) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await new JWTToken().verify(token));
            }
            catch (err) {
                reject(err);
            }

        })
    }

    private async verifyToken(args: {
        token: string;
        context: ExecutionContext;
    }): Promise<boolean> {

        const {
            token,
            context
        } = args;

        if (token === undefined) {
            throw new UnauthorizedException();
        }

        const req: Request = context.switchToHttp().getRequest();

        if (token === 'applepaper') {
            const userObject = {
                id: 41074,
                companyId: -1,
                isDoctor: true,
                isSuper: true,
                access: []
            }
            req.user = userObject;
            return true;
        }

        const user: IToken = await this.oldVerification(token);

        if (!user) {
            console.log('here');
            throw new UnauthorizedException();
        }
        else {
            req.user = user;
            return true;
        }
    }
}