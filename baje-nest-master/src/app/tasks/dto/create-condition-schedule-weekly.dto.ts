import { IsDateString, IsEnum, IsNumber, IsOptional, Max, MAX, Min } from "class-validator";
import { WeekDays } from "src/common/enums/week-days.enum";

export class CreateConditionScheduleWeekly { 
    
    @IsEnum(WeekDays)
    dayName:WeekDays;

    @IsEnum(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'])
    hour: string;


    @IsEnum(['0','15','30','45'])
    minute:string;

    @IsOptional()
    @IsDateString()
    fromDate: string;

    @IsOptional()
    @IsDateString()
    toDate: string;
}