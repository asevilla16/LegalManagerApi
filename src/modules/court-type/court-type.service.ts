import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCourtTypeDto } from './dto/create-court-type.dto';
import { UpdateCourtTypeDto } from './dto/update-court-type.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CourtTypeService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CourtTypeService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('CourtTypeService initialized');
  }

  async create(createCourtTypeDto: CreateCourtTypeDto) {
    const { ...courtTypeData } = createCourtTypeDto;
    const newCourtType = await this.courtType.create({
      data: {
        ...courtTypeData,
        isActive: true,
        createdAt: new Date(),
      },
    });

    if (!newCourtType) {
      throw new Error('Failed to create court type');
    }

    return newCourtType;
  }

  findAll() {
    const courtTypes = this.courtType.findMany({
      where: { isActive: true },
    });
    if (!courtTypes) {
      throw new Error('No court types found');
    }
    return courtTypes;
  }

  findOne(id: number) {
    const courtType = this.courtType.findUnique({
      where: { id },
    });
    if (!courtType) {
      throw new Error('Court type not found');
    }
    return courtType;
  }

  findByJurisdictionLevel(jurisdictionLevel: string) {
    const courtTypes = this.courtType.findMany({
      where: { jurisdictionLevel, isActive: true },
    });
    if (!courtTypes) {
      throw new Error(
        'No court types found for the specified jurisdiction level',
      );
    }
    return courtTypes;
  }

  update(id: number, updateCourtTypeDto: UpdateCourtTypeDto) {
    return `This action updates a #${id} courtType`;
  }

  remove(id: number) {
    return `This action removes a #${id} courtType`;
  }
}
