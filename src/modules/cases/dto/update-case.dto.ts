import { PartialType } from '@nestjs/mapped-types';
import { CreateCaseDto } from './create-case.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateCaseDto extends PartialType(CreateCaseDto) {
  @IsString()
  caseId: number;

  @IsOptional()
  @IsString()
  outcome?: string; // Outcome of the case if applicable

  @IsDateString()
  @IsOptional()
  closedDate?: Date;
}
