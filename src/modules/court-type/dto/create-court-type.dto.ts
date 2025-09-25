import { IsString } from 'class-validator';

export class CreateCourtTypeDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  jurisdictionLevel: string;

  @IsString()
  description?: string;
}
