import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class ForwardTaskDto {

  @IsArray()
  @IsNumber({}, {each: true})
  forwardTo: number[]

  @IsOptional()
  @IsString()
  forwardDescription: string;
}