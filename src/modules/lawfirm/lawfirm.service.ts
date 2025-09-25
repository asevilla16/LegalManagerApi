import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateLawfirmDto } from './dto/create-lawfirm.dto';
import { UpdateLawfirmDto } from './dto/update-lawfirm.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class LawfirmService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(LawfirmService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('ClientsService initialized');
  }

  create(createLawfirmDto: CreateLawfirmDto) {
    const firm = {
      ...createLawfirmDto,
      isActive: true,
      createdAt: new Date(),
    };

    try {
      const lawfirm = this.lawFirm.create({ data: firm });
      return lawfirm;
    } catch (error) {
      this.logger.error('Error creating lawfirm', error);
      throw error;
    }
  }

  findAll() {
    return this.lawFirm.findMany();
  }

  findOne(id: number) {
    return this.lawFirm.findUnique({ where: { id } });
  }

  update(id: number, updateLawfirmDto: UpdateLawfirmDto) {
    return `This action updates a #${id} lawfirm`;
  }

  remove(id: number) {
    return `This action removes a #${id} lawfirm`;
  }
}
