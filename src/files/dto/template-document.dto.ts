import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TemplateDocumentDto {
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
