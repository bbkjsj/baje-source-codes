import { HttpException, Injectable } from "@nestjs/common";
import { Encryption } from "src/common/helpers/encryption";
import { JWTToken } from "src/common/helpers/jwt";
import { RandomNumber } from "src/common/helpers/randomnumber";
import { KavenegarSMS } from 'src/common/providers/sms/kavenegar';
import { AuthService } from '../auth/auth.service';
import { IAuthWhoAmI } from '../auth/interfaces';
import { PersonnelService } from "../personnel/personnel.service";
import { SignDTO } from "./dtos/sign.dto";
import { VerifyDTO } from "./dtos/verify.dto";

@Injectable()
export class SignService {

    constructor(
        private readonly personnelService: PersonnelService,
        private readonly authService: AuthService,
        ){}


    async login(dto: SignDTO) {
        try{
            const _pass = await new Encryption().encrypt(dto.password);

            const personnel = await this.personnelService.findPersonByUserPassword(dto.username, _pass);


            if(personnel){
                if(personnel.mobile1 || personnel.mobile2) {
                    const rndNumber = await new RandomNumber(100001, 999999).generate();
                    const rndHash = new Encryption().encrypt(rndNumber.toString());

                    await this.personnelService.updateCode(personnel.id, rndHash);

                    new KavenegarSMS().sendVerificationCode({
                        code: rndNumber.toString(),
                        mobile: personnel.mobile1
                    });

                    return {
                        id: personnel.id
                    }

                }
                else {
                    throw new HttpException('شماره موبایل شما در سامانه وارد نشده است. لطفا با واحد پشتیبانی تماس حاصل فرمایید', 400);
                }
            }
            else {
                throw new HttpException('incorrect username/password', 400);
            }
        }
        catch(err){
            throw err;
        }
    }

    async verify(dto: VerifyDTO) {
        try{
            const personnel = await this.personnelService.findPersonnelById(dto.id);

            if(personnel){
                const hashCode = await new Encryption().encrypt(dto.code);
                if(personnel.code == hashCode) {

                    const token = await new JWTToken().create({
                        id: personnel.id,
                        companyId: personnel.company_id_fk != null ? personnel.company_id_fk : -1,
                        isDoctor : personnel.user_type === 'doctor'? true : false,
                        isSuper : personnel.is_super_user == null ? false : personnel.is_super_user == 1 ? true : false
                    });

                    const whoAmI: IAuthWhoAmI = await this.authService.whoAmI(personnel.id);

                    return {
                        token: token,
                        user: whoAmI
                    };
                }
                else {
                    throw new HttpException('incorrect code', 400);
                }
            }
            else {
                throw new HttpException('invalid user id', 400);
            }
        }
        catch(err) {
            throw err;
        }
    }
}