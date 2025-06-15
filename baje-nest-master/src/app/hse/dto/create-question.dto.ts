import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { HSERateType } from "src/common/enums/hse-rate-type.enum";


export class HSECreateQuestionDTO {

    @IsNotEmpty()
    group: string;

    @IsNotEmpty()
    question: string;

    @IsEnum(HSERateType)
    type: string;

    @IsBoolean()
    isReverse: boolean;
}
