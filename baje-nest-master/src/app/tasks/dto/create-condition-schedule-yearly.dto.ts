import { IsDateString, IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateConditionScheduleYearly {
    @IsEnum([ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
    day: string;


    @IsEnum([ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    month: number;

    @IsOptional()
    @IsDateString()
    fromDate: string;

    @IsOptional()
    @IsDateString()
    toDate: string;

}