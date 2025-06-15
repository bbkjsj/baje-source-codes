import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class PersonnelAvailabilityRequest {

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  readonly codes: string[]

  constructor(args: PersonnelAvailabilityRequest) {
    Object.assign(this, args);
  }
}
