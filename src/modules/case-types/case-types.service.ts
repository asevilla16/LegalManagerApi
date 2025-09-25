import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCaseTypeDto } from './dto/create-case-type.dto';
import { UpdateCaseTypeDto } from './dto/update-case-type.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CaseTypesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CaseTypesService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Case Type initialized');
  }

  async create(createCaseTypeDto: CreateCaseTypeDto) {
    const existingCaseType = await this.caseType.findFirst({
      where: {
        name: createCaseTypeDto.name,
        code: createCaseTypeDto.code,
      },
    });

    if (existingCaseType) {
      throw new Error('Case type with this name or code already exists');
    }

    const newCaseType = await this.caseType.create({
      data: {
        ...createCaseTypeDto,
        isActive: true,
        createdAt: new Date(),
      },
    });

    if (!newCaseType) {
      throw new Error('Failed to create case type');
    }

    return newCaseType;
  }

  findAll() {
    const caseTypes = this.caseType.findMany({
      where: { isActive: true },
    });

    if (!caseTypes) {
      throw new Error('No case types found');
    }
    return caseTypes;
  }

  findOne(id: number) {
    const caseType = this.caseType.findUnique({ where: { id } });
    if (!caseType) {
      throw new Error('Case type not found');
    }
    return caseType;
  }

  update(id: number, updateCaseTypeDto: UpdateCaseTypeDto) {
    return `This action updates a #${id} caseType`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseType`;
  }
}
