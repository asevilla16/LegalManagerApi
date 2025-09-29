import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StatisticsService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(StatisticsService.name);
  async onModuleInit() {
    this.logger.log('StatisticsService initialized');
    await this.$connect();
  }

  async findAll() {
    return await this.case.count({
      where: { isActive: true },
    });
  }

  async getCasesByStatus() {
    const grouped = await this.case.groupBy({
      by: ['caseStatusId'],
      _count: {
        id: true,
      },
      where: {
        isActive: true,
      },
    });

    const statusIds = grouped.map((g) => g.caseStatusId);

    const statuses = await this.caseStatus.findMany({
      where: { id: { in: statusIds } },
    });

    return grouped.map((g) => {
      return {
        count: g._count.id,
        status: statuses.find((s) => s.id === g.caseStatusId).name,
      };
    });
  }

  async getActiveAndInactiveCases() {
    const activeCases = await this.case.count({
      where: { isActive: true },
    });
    const inactiveCases = await this.case.count({
      where: { isActive: false },
    });
    return { activeCases, inactiveCases };
  }

  async getCasesByType() {
    return await this.case.groupBy({
      by: ['caseTypeId'],
      _count: {
        id: true,
      },
      where: {
        isActive: true,
      },
    });
  }

  async getCasesByAttorney() {
    return await this.case.groupBy({
      by: ['primaryAttorneyId'],
      _count: {
        id: true,
      },
      where: {
        isActive: true,
      },
    });
  }

  async getTotalClients() {
    return await this.client.count({
      where: { isActive: true },
    });
  }

  async getCasesFiledInCurrentMonth() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const count = this.case.count({
      where: {
        filingDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        isActive: true,
      },
    });

    const cases = await this.case.findMany({
      where: {
        filingDate: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        caseNumber: true,
        filingDate: true,
        caseType: {
          select: {
            name: true,
          },
        },
        caseStatus: {
          select: {
            name: true,
          },
        },
        courtType: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        filingDate: 'desc',
      },
    });

    const ids = cases.map((c) => c.id);

    const caseAssignments = await this.caseAssignment.findMany({
      where: { caseId: { in: ids } },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const casesWithAssignments = cases.map((c) => {
      const { caseType, caseStatus, courtType, ...rest } = c;
      const assignments = caseAssignments.filter((ca) => ca.caseId === c.id);
      return {
        ...rest,
        caseType: caseType.name,
        caseStatus: caseStatus.name,
        courtType: courtType.name,
        assignments: assignments.map((a) => a.user),
      };
    });

    return { count: await count, cases: casesWithAssignments };
  }

  async getCasesByMonth() {
    const cases = await this.case.findMany({
      where: { isActive: true },
      select: { filingDate: true },
      orderBy: { filingDate: 'asc' },
    });

    console.log({ cases });

    const grouped = cases.reduce((acc, case_) => {
      const monthYear = case_.filingDate.toISOString().substring(0, 7); // YYYY-MM
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([monthYear, count]) => ({
      month: this.getSpanishMonthName(Number(monthYear.split('-')[1])),
      year: Number(monthYear.split('-')[0]),
      count,
    }));
  }

  async getCasesByPracticeArea() {
    const grouped = await this.case.groupBy({
      by: ['caseTypeId'],
      _count: {
        id: true,
      },
      where: {
        isActive: true,
      },
    });

    const typeIds = grouped.map((g) => g.caseTypeId);

    const caseTypes = await this.caseType.findMany({
      where: { id: { in: typeIds } },
    });

    return grouped.map((g) => ({
      practiceArea: caseTypes.find((t) => t.id === g.caseTypeId)?.name,
      count: g._count.id,
    }));
  }

  getNewClientsThisMonth() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.client.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        isActive: true,
      },
    });
  }

  getSpanishMonthName(monthNumber: number): string {
    const date = new Date(2024, monthNumber - 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }
}
