import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateDamageServiceDTO {

    @IsNotEmpty()
    @IsEnum(['خدمت', 'خسارت'])
    type: string;

    @IsNotEmpty()
    personnel_id: string;

    @IsOptional()
    date: Date;

    @IsOptional()
    description: string;

    @IsOptional()
    type_service_damage: string;

    @IsOptional()
    type_reward_penalty: string;

    @IsOptional()
    amount_reward_penalty: string;

    @IsOptional()
    hr_approved: boolean;

    @IsOptional()
    project_admin_approved: boolean;

    @IsOptional()
    manager_approved: boolean;

}