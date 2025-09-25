import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateCaseStatusDto {
  @IsString()
  name: string;
  @IsString()
  code: string;

  @IsBoolean()
  isFinal: boolean;

  @IsInt()
  sortOrder: number;
}
