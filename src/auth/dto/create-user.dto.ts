import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/auth.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  @IsPhoneNumber() // Allow any country format
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  barNumber?: string;

  @IsDateString()
  @IsOptional()
  barRegistrationDate?: Date;
}
