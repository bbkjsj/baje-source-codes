import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTaskNotMyDutyDTO { 
    @IsNumber()
    taskId:number;

    @IsNotEmpty()
    description: string;
}