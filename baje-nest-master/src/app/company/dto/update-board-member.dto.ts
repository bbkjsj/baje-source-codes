import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CreateBoardMemberDTO } from "./create-board-member.dto";

export class UpdateBoardMemberDTO extends PartialType(CreateBoardMemberDTO) {}