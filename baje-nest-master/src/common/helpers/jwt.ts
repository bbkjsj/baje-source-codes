import { UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import * as fs from 'fs';
import path from 'path';
export class JWTToken {

    constructor(){
    }

    async create(user: IToken): Promise<string> {
        try{
            const privateKey: string = fs.readFileSync(`${process.cwd()}/private.key`).toString();

            return await jwt.sign(user, privateKey, {
                expiresIn: '1000h',
                algorithm: 'RS256'
            })
        }
        catch(err) {
            throw err;
        }
    }

    async verify(token: string):Promise<IToken> {
        try{
            const publicKey: string = fs.readFileSync(`${process.cwd()}/public.pem`).toString();

            return await jwt.verify(token, publicKey, {
                algorithm: 'RS256'
            });
        }
        catch(err){
            throw new UnauthorizedException('unable to verify token');
        }
    }


}

export interface IToken {
    id: number;
    companyId: number;
    isDoctor: boolean;
    isSuper: boolean;
    access?:any;
    name?: string;
}

declare module 'express' {
    interface Request {
        user: IToken,
    }
}