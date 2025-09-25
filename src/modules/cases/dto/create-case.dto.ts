import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsInt()
  lawFirmId: number;

  @IsString()
  caseNumber: string;

  @IsString()
  courtCaseNumber?: string;

  @IsString()
  title: string;

  @IsInt()
  caseTypeId: number;

  @IsString()
  description?: string;

  @IsInt()
  caseStatusId: number;

  @IsInt()
  @IsOptional()
  courtTypeId?: number;
  //priority: string; //'LOW' | 'MEDIUM' | 'HIGH';

  @IsDateString()
  filingDate: Date;

  @IsString()
  @IsOptional()
  primaryAttorneyId?: string;

  @IsString()
  @IsOptional()
  originatingAttorneyId?: string;

  @IsString()
  createdBy: string;

  @IsInt()
  clientId: number;
}
