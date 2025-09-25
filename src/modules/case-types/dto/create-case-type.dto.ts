import { IsInt, IsString } from 'class-validator';

export class CreateCaseTypeDto {
  @IsString()
  name: string;
  @IsString()
  code: string;

  @IsString()
  category: string; //'CIVIL' | 'CRIMINAL' | 'FAMILY' | 'LABOR' | 'COMMERCIAL' | 'ADMINISTRATIVE' | 'TAX' | 'MIXED';
  @IsInt()
  statuteOfLimitationDays?: number;
  @IsString()
  description?: string;
}
