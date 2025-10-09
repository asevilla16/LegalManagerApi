import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import e from 'express';

@Injectable()
export class CasesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(CasesService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('ClientsService initialized');
  }

  async create(createCaseDto: CreateCaseDto) {
    const {
      caseTypeId,
      caseStatusId,
      courtTypeId,
      primaryAttorneyId,
      originatingAttorneyId,
      createdBy,
      lawFirmId,
      filingDate,
      clientId,
      ...caseData
    } = createCaseDto;

    await this.validateCaseData(createCaseDto);

    const newCaseData = {
      ...caseData,
      filingDate: new Date(filingDate),
      createdAt: new Date(),
      isActive: true,
    };

    const creator = await this.user.findUnique({
      where: { username: createdBy },
    });

    const clientPromise = this.client.findUnique({
      where: { id: clientId },
    });

    const newCase = await this.case.create({
      data: {
        ...newCaseData,
        caseType: {
          connect: {
            id: +caseTypeId,
          },
        },
        caseStatus: {
          connect: {
            id: +caseStatusId,
          },
        },
        ...(courtTypeId && {
          courtType: {
            connect: {
              id: +courtTypeId,
            },
          },
        }),
        ...(primaryAttorneyId && {
          primaryAttorney: {
            connect: {
              id: primaryAttorneyId,
            },
          },
        }),
        ...(originatingAttorneyId && {
          originatingAttorney: {
            connect: {
              id: originatingAttorneyId,
            },
          },
        }),
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

    if (!newCase) {
      throw new Error('Failed to create case');
    }

    const client = await clientPromise;

    const casePartyClient = this.caseParty.create({
      data: {
        case: {
          connect: {
            id: newCase.id,
          },
        },
        client: {
          connect: {
            id: clientId,
          },
        },
        partyType: 'DEFENDANT',
        name: this.buildClientName(client),
        email: client.email,
        phone: client.phone,
        address: client.address,
        isActive: true,
        isClient: true,
        createdAt: new Date(),
      },
    });

    const caseAssignment = this.caseAssignment.create({
      data: {
        case: {
          connect: {
            id: newCase.id,
          },
        },
        user: {
          connect: {
            id: primaryAttorneyId ? primaryAttorneyId : originatingAttorneyId,
          },
        },
        role: primaryAttorneyId ? 'PRIMARY_ATTORNEY' : 'ORIGINATING_ATTORNEY',
        isActive: true,
        assignmentDate: new Date(),
        createdAt: new Date(),
      },
    });

    await casePartyClient;
    await caseAssignment;

    if (!casePartyClient) {
      throw new Error('Failed to create case party for client');
    }

    if (!caseAssignment) {
      throw new Error('Failed to create case assignment');
    }

    return newCase;
  }

  async findAll() {
    const cases = await this.case.findMany({
      where: { isActive: true },
      include: {
        caseType: true,
        caseStatus: true,
        courtType: true,
        primaryAttorney: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        originatingAttorney: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    const casesWithParties = await Promise.all(
      cases.map(async (item) => {
        const caseParties = await this.caseParty.findMany({
          where: { caseId: item.id, isActive: true },
          include: { client: true },
        });
        return { ...item, parties: caseParties };
      }),
    );

    if (!cases) {
      throw new Error('No cases found');
    }

    return casesWithParties;
  }

  async findPaginatedCases(pagination: PaginationDto) {
    const { page, pageSize } = pagination;

    const parsedPageSize = Number(pageSize);
    const parsedPage = Number(page);

    const totalItems = await this.case.count({ where: { isActive: true } });

    const lastPage = Math.ceil(totalItems / parsedPageSize);

    const cases = await this.case.findMany({
      where: { isActive: true },
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
        primaryAttorney: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        originatingAttorney: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      take: parsedPageSize,
      skip: (parsedPage - 1) * parsedPageSize,
    });

    const casesWithParties = await Promise.all(
      cases.map(async (item) => {
        const caseParties = await this.caseParty.findMany({
          where: { caseId: item.id, isActive: true },
          select: {
            id: true,
            name: true,
            partyType: true,
            isClient: true,
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
        return { ...item, parties: caseParties };
      }),
    );

    if (!cases) {
      throw new Error('No cases found');
    }

    return {
      parsedPage,
      totalItems,
      lastPage,
      pageSize: cases.length,
      data: casesWithParties,
    };
  }

  async findOne(id: number) {
    const caseById = await this.case.findUnique({
      where: { id },
      include: {
        caseType: true,
        caseStatus: true,
        courtType: true,
        primaryAttorney: true,
        originatingAttorney: true,
        lawFirm: true,
        creator: true,
      },
    });

    const caseParties = await this.caseParty.findMany({
      where: { caseId: id, isActive: true },
    });

    const caseDocuments = await this.document.findMany({
      where: { caseId: id },
    });

    const caseWithPartiesAndDocuments = {
      ...caseById,
      parties: caseParties.map((x) => {
        return {
          id: x.id,
          name: x.name,
          partyType: x.partyType,
          clientId: x.clientId,
          isClient: x.isClient,
        };
      }),
      documents: caseDocuments.map((doc) => {
        return {
          id: doc.id,
          title: doc.title,
          description: doc.title,
          filePath: doc.filePath,
        };
      }),
    };

    if (!caseById) {
      throw new Error('Case not found');
    }

    return caseWithPartiesAndDocuments;
  }

  async update(id: number, updateCaseDto: UpdateCaseDto) {
    const {
      caseId,
      lawFirmId,
      clientId,
      caseTypeId,
      caseStatusId,
      courtTypeId,
      originatingAttorneyId,
      primaryAttorneyId,
      createdBy,
      ...restCase
    } = updateCaseDto;
    const caseToUpdate = this.case.findUnique({ where: { id } });
    if (!caseToUpdate) {
      throw new Error('Case not found');
    }

    const caseUpdated = await this.case.update({
      where: { id },
      data: {
        ...restCase,
        updatedAt: new Date(),
        isActive: true,
        ...(caseTypeId && {
          caseType: {
            connect: {
              id: +caseTypeId,
            },
          },
        }),
        ...(caseStatusId && {
          caseStatus: {
            connect: {
              id: +caseStatusId,
            },
          },
        }),
        ...(courtTypeId && {
          courtType: {
            connect: {
              id: +courtTypeId,
            },
          },
        }),
        ...(primaryAttorneyId && {
          primaryAttorney: {
            connect: {
              id: primaryAttorneyId,
            },
          },
        }),
        ...(originatingAttorneyId && {
          originatingAttorney: {
            connect: {
              id: originatingAttorneyId,
            },
          },
        }),
      },
    });

    if (!caseUpdated) {
      throw new Error('Failed to update case');
    }

    if (clientId) {
      await this.handleClientChange(id, clientId);
    }

    return caseUpdated;
  }

  remove(id: number) {
    return `This action removes a #${id} case`;
  }

  private async verifyIfClientExistsAsParty(
    clientId: number,
    caseId: number,
  ): Promise<boolean> {
    const client = await this.client.findUnique({ where: { id: clientId } });
    if (!client) {
      throw new Error('Client not found');
    }

    const existingCaseParty = await this.caseParty.findFirst({
      where: { clientId, isActive: true, caseId },
    });

    if (existingCaseParty) {
      return true;
    }

    return false;
  }

  private async handleClientChange(caseId: number, newClientId: number | null) {
    // Get current client party
    const existingClientParty = await this.caseParty.findFirst({
      where: {
        caseId,
        isClient: true,
        isActive: true,
      },
    });

    if (newClientId === null) {
      // Remove client (deactivate existing client party)
      if (existingClientParty) {
        await this.caseParty.update({
          where: { id: existingClientParty.id },
          data: { isActive: false },
        });
      }
      return;
    }

    // Validate new client exists
    const newClient = await this.client.findUnique({
      where: { id: newClientId },
    });
    if (!newClient) {
      throw new Error('Client not found');
    }

    if (existingClientParty) {
      if (existingClientParty.clientId === newClientId) {
        // Same client, no change needed
        return;
      }

      // Different client - deactivate old and create new
      await this.caseParty.update({
        where: { id: existingClientParty.id },
        data: { isActive: false },
      });
    }

    // Create new client party
    await this.caseParty.create({
      data: {
        caseId,
        clientId: newClientId,
        partyType: 'DEFENDANT', // or whatever default you prefer
        name: `${newClient.firstName} ${newClient.lastName}`,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        isActive: true,
        isClient: true,
        createdAt: new Date(),
      },
    });
  }

  private buildClientName(client: any) {
    if (client.clientType === 'COMPANY') {
      return client.companyName;
    }
    return client.firstName + ' ' + client.lastName;
  }

  private async validateCaseData(caseData: CreateCaseDto) {
    const {
      caseTypeId,
      caseStatusId,
      courtTypeId,
      primaryAttorneyId,
      originatingAttorneyId,
      createdBy,
      lawFirmId,
    } = caseData;

    const existingLawFirm = await this.lawFirm.findUnique({
      where: { id: lawFirmId },
    });

    if (!existingLawFirm) {
      throw new Error('Law firm not found');
    }
    const existingCaseType = await this.caseType.findUnique({
      where: { id: +caseTypeId },
    });
    if (!existingCaseType) {
      throw new Error('Case type not found');
    }
    const existingCaseStatus = await this.caseStatus.findUnique({
      where: { id: +caseStatusId },
    });
    if (!existingCaseStatus) {
      throw new Error('Case status not found');
    }

    if (courtTypeId) {
      const existingCourtType = await this.courtType.findUnique({
        where: { id: +courtTypeId },
      });
      if (!existingCourtType) {
        throw new Error('Court type not found');
      }
    }

    if (primaryAttorneyId) {
      const primaryAttorney = await this.user.findUnique({
        where: { id: primaryAttorneyId },
      });
      if (!primaryAttorney) {
        throw new Error('Primary attorney not found');
      }
      if (primaryAttorney.lawFirmId !== lawFirmId) {
        throw new Error(
          'Primary attorney does not belong to the specified law firm',
        );
      }
    }

    if (originatingAttorneyId) {
      const originatingAttorney = await this.user.findUnique({
        where: { id: originatingAttorneyId },
      });
      if (!originatingAttorney) {
        throw new Error('Originating attorney not found');
      }
      if (originatingAttorney.lawFirmId !== lawFirmId) {
        throw new Error(
          'Originating attorney does not belong to the specified law firm',
        );
      }
    }

    const creator = await this.user.findUnique({
      where: { username: createdBy },
    });
    if (!creator) {
      throw new Error('Creator user not found');
    }
    if (creator.lawFirmId !== lawFirmId) {
      throw new Error('Creator user does not belong to the specified law firm');
    }
  }
}
