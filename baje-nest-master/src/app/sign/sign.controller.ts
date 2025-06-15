import { Body, Controller, Post } from "@nestjs/common";
import { SignDTO } from "./dtos/sign.dto";
import { VerifyDTO } from "./dtos/verify.dto";
import { SignService } from "./sign.service";


@Controller('sign')
export class SignController { 
    constructor(private readonly service: SignService){}


    @Post()
    async sign(@Body() body: SignDTO){
        return await this.service.login(body);
    }

    @Post('/verify')
    async verify(@Body() body: VerifyDTO) {
        return await this.service.verify(body);
    }
}