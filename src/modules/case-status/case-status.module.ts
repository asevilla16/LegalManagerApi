import { Module } from '@nestjs/common';
import { CaseStatusService } from './case-status.service';
import { CaseStatusController } from './case-status.controller';

@Module({
  controllers: [CaseStatusController],
  providers: [CaseStatusService],
})
export class CaseStatusModule {}
