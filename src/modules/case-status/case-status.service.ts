import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCaseStatusDto } from './dto/create-case-status.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CaseStatusService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CaseStatusService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Case Status initialized');
  }

  async create(createCaseStatusDto: CreateCaseStatusDto) {
    const existingCaseStatus = await this.caseStatus.findFirst({
      where: {
        name: createCaseStatusDto.name,
        code: createCaseStatusDto.code,
      },
    });

    if (existingCaseStatus) {
      throw new Error('Case status with this name or code already exists');
    }

    const newCaseStatus = await this.caseStatus.create({
      data: {
        ...createCaseStatusDto,
        isActive: true,
      },
    });

    if (!newCaseStatus) {
      throw new Error('Failed to create case status');
    }

    return newCaseStatus;
  }

  findAll() {
    const caseStatuses = this.caseStatus.findMany({
      where: { isActive: true },
    });

    if (!caseStatuses) {
      throw new Error('No case statuses found');
    }

    return caseStatuses;
  }

  findOne(id: number) {
    const caseStatus = this.caseStatus.findUnique({ where: { id } });
    if (!caseStatus) {
      throw new Error('Case status not found');
    }
    return caseStatus;
  }

  update(id: number, updateCaseStatusDto: UpdateCaseStatusDto) {
    return `This action updates a #${id} caseStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseStatus`;
  }
}
