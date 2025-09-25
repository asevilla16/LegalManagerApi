import { PartialType } from '@nestjs/mapped-types';
import { CreateCaseStatusDto } from './create-case-status.dto';

export class UpdateCaseStatusDto extends PartialType(CreateCaseStatusDto) {}
