import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { UpdateStatisticDto } from './dto/update-statistic.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('cases')
  findAllCases() {
    return this.statisticsService.findAll();
  }

  @Get('cases/cases-by-status')
  getCasesSummary() {
    return this.statisticsService.getCasesByStatus();
  }

  @Get('cases/get-active-and-inactive-cases')
  getActiveAndInactiveCases() {
    return this.statisticsService.getActiveAndInactiveCases();
  }

  @Get('cases/cases-by-type')
  getCasesByType() {
    return this.statisticsService.getCasesByType();
  }

  @Get('cases/cases-by-attorney')
  getCasesByAttorney() {
    return this.statisticsService.getCasesByAttorney();
  }

  @Get('cases/cases-of-the-month')
  getCasesOfTheMonth() {
    return this.statisticsService.getCasesFiledInCurrentMonth();
  }

  @Get('clients/total-clients')
  getTotalClients() {
    return this.statisticsService.getTotalClients();
  }

  @Get('clients/new-clients-this-month')
  getNewClientsThisMonth() {
    return this.statisticsService.getNewClientsThisMonth();
  }

  @Get('cases/cases-by-practice-area')
  getCasesByPracticeArea() {
    return this.statisticsService.getCasesByPracticeArea();
  }

  @Get('cases/cases-by-month')
  getCasesByMonth() {
    return this.statisticsService.getCasesByMonth();
  }
}
