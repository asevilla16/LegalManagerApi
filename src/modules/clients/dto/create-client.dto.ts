import {
  IsDate,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateClientDto {
  @IsInt()
  @IsPositive()
  lawFirmId: number;

  @IsString()
  clientType: string; // 'INDIVIDUAL', 'CORPORATE', 'GOVERNMENT'

  // Individual client fields
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  identityDocument?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  // Corporate client fields
  @IsString()
  @IsOptional()
  companyName?: string;
  @IsString()
  taxId?: string;

  // Common fields
  @IsString()
  address?: string;
  @IsString()
  city?: string;
  @IsString()
  department?: string;
  @IsString()
  postalCode?: string;

  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  @IsPhoneNumber()
  mobile?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  occupation?: string;

  @IsString()
  createdBy: string; // ID of the user creating the client
}
