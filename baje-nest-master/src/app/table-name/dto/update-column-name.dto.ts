import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CreateColumnNameDTO } from "./create-column-name.dto";

export class UpdateColumnNameDTO extends PartialType(CreateColumnNameDTO) {}