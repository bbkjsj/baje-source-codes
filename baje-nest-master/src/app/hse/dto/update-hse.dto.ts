import { PartialType } from '@nestjs/mapped-types';
import { HSECreateQuestionDTO } from './create-question.dto';

export class UpdateHseDto extends PartialType(HSECreateQuestionDTO) {}
