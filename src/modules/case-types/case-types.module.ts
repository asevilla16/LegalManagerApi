import { Module } from '@nestjs/common';
import { CaseTypesService } from './case-types.service';
import { CaseTypesController } from './case-types.controller';

@Module({
  controllers: [CaseTypesController],
  providers: [CaseTypesService],
})
export class CaseTypesModule {}
