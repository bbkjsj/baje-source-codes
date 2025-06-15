import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTimeOffDTO { 

    @IsNotEmpty()
    personnel_id: number;


    @IsNotEmpty()
    @IsEnum(['استحقاقی', 'استعلاجی', 'تشویقی', 'بدون حقوق'])
    type: string;

    
    @IsNotEmpty()
    @IsEnum(['روزانه', 'ساعتی'])
    request_type: string;

    @IsNotEmpty()
    @IsDateString()
    from_date: Date;

    @IsNotEmpty()
    @IsDateString()
    to_date: Date;

    @IsOptional()
    description: string;
}