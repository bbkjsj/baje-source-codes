import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { ArmyService } from "src/common/enums/army-service.enum";
import { Gender } from "src/common/enums/gender.enum";
import { JobStatus } from "src/common/enums/job-status.enum";
import { JobType } from "src/common/enums/job-type.enum";
import { MaritalStatus } from "src/common/enums/marital-status.enum";
import { CreatePersonDTO } from "./create-person.dto";
import { CreatePersonnelAccessDTO } from "./create-personnel-access.dto";
import { CreateSubordinateDTO } from "./create-subordinate.dto";


export class UpdatePersonDTO extends PartialType(CreatePersonDTO) { 
}