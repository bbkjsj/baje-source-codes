import { IsArray, IsNumber } from "class-validator";

export class DeleteCompanyDto {

  @IsNumber({}, { each: true })
  ids: number[]
}
