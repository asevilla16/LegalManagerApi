import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ClientsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ClientsService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('ClientsService initialized');
  }

  async create(createClientDto: CreateClientDto) {
    const { createdBy, lawFirmId, birthDate, ...clientData } = createClientDto;

    const existingLawFirm = this.lawFirm.findUnique({
      where: { id: lawFirmId },
    });

    if (!existingLawFirm) {
      throw new Error('Law firm not found');
    }

    const existingClient = await this.client.findFirst({
      where: {
        email: createClientDto.email,
        lawFirmId: lawFirmId,
      },
    });

    if (existingClient) {
      throw new Error('Client with this email already exists in the law firm');
    }

    const creator = await this.user.findUnique({
      where: { username: createdBy },
    });

    if (!creator) {
      throw new Error('Creator user not found');
    }

    const newClientData = {
      ...clientData,
      isActive: true,
      createdAt: new Date(),
      birthDate: birthDate ? new Date(birthDate) : null,
    };

    const newClient = await this.client.create({
      data: {
        ...newClientData,
        lawFirm: {
          connect: {
            id: lawFirmId,
          },
        },
        creator: {
          connect: {
            id: creator.id,
          },
        },
      },
    });

    if (!newClient) {
      throw new Error('Failed to create client');
    }

    return newClient;
  }

  async findPaginatedClients(pagination: PaginationDto) {
    const { pageSize, page } = pagination;

    const totalPages = await this.client.count({ where: { isActive: true } });
    const lastPage = Math.ceil(totalPages / pageSize);

    const clients = await this.client.findMany({
      where: { isActive: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    if (!clients) {
      throw new Error('No clients found');
    }

    return {
      page,
      totalItems: totalPages,
      lastPage,
      pageSize: clients.length,
      data: clients,
    };
  }

  async findAll() {
    const clients = await this.client.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        companyName: true,
      },
    });

    if (!clients) {
      throw new Error('No clients found');
    }

    return clients;
  }

  async findOne(id: number) {
    const client = await this.client.findUnique({
      where: { id },
      include: { lawFirm: true },
    });

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = this.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return await this.client.update({
      where: { id },
      data: { ...updateClientDto, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    const client = await this.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    if (client.isActive === false) {
      throw new Error('Client is already deactivated');
    }

    client.isActive = false;
    client.updatedAt = new Date();

    await this.client.update({
      where: { id },
      data: client,
    });

    return { message: 'Client successfully deactivated' };
  }

  async activateClient(id: number) {
    const client = await this.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    if (client.isActive === true) {
      throw new Error('Client is already active');
    }

    client.isActive = true;
    client.updatedAt = new Date();

    await this.client.update({
      where: { id },
      data: client,
    });

    return { message: 'Client successfully activated' };
  }
}
