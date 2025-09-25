import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CaseDocumentDto {
  @IsString()
  caseId: string;

  @IsString()
  clientId: string;

  @IsString()
  documentTypeId: string;

  @IsBoolean()
  @IsOptional()
  isPrivileged: boolean;

  @IsBoolean()
  @IsOptional()
  isEvidence: boolean;

  @IsOptional()
  @IsString()
  confidentialityLevel: string;

  @IsString()
  versionNumber: string;

  @IsString()
  @IsOptional()
  parentDocumentId: string;

  @IsString()
  createdBy: string;
}
