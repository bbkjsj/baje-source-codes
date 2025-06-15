import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsNumber, IsDateString } from "class-validator";
import { CreateContractDTO } from './create.dto';


export class UpdateContractDTO extends PartialType(CreateContractDTO) {

    @IsNumber()
    oldContractorId: number;
}