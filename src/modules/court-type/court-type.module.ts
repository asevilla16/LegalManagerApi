import { Module } from '@nestjs/common';
import { CourtTypeService } from './court-type.service';
import { CourtTypeController } from './court-type.controller';

@Module({
  controllers: [CourtTypeController],
  providers: [CourtTypeService],
})
export class CourtTypeModule {}
