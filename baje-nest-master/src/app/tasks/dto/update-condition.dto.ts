import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskConditionDTO } from "./create-condition.dto";

export class UpdateTaskConditionDTO extends PartialType(CreateTaskConditionDTO) {}