import { Module } from "@nestjs/common";
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { PersonnelModule } from "../personnel/personnel.module";
import { SignController } from "./sign.controller";
import { SignService } from "./sign.service";

@Module({
    imports: [PersonnelModule, AuthModule],
    controllers: [SignController],
    providers: [SignService]
})
export class SignModule{}