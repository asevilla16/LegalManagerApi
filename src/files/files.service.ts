import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';
import { CaseDocumentDto } from './dto/case-document.dto';
import { TemplateDocumentDto } from './dto/template-document.dto';

@Injectable()
export class FilesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('FilesService initialized');
  }

  async saveFileRecord(
    file: Express.Multer.File,
    caseDocumentDto: CaseDocumentDto,
  ) {
    const {
      clientId,
      caseId,
      documentTypeId,
      parentDocumentId,
      createdBy,
      ...documentData
    } = caseDocumentDto;
    const secureUrl = `${process.env.HOST_API}/files/case-file/${file.filename}`;

    await this.validateFileData(caseDocumentDto);

    const originalname = file.originalname.replace(/\s+/g, '-').toLowerCase();

    const creator = await this.user.findUnique({
      where: { username: createdBy },
    });

    if (!creator) throw new Error('Creator User not found');

    const newDocument = await this.document.create({
      data: {
        originalName: originalname,
        fileName: file.filename,
        title: '',
        filePath: secureUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentDate: new Date(),
        receivedDate: new Date(),
        isPrivileged: documentData.isPrivileged || false,
        isEvidence: documentData.isEvidence || false,
        confidentialityLevel: documentData.confidentialityLevel || 'NORMAL',
        versionNumber: +documentData.versionNumber,
        case: {
          connect: {
            id: +caseId,
          },
        },
        client: {
          connect: {
            id: +clientId,
          },
        },
        documentType: {
          connect: {
            id: +documentTypeId,
          },
        },
        ...(parentDocumentId && {
          parentDocument: {
            connect: {
              id: +parentDocumentId,
            },
          },
        }),
        creator: {
          connect: {
            id: creator.id,
          },
        },
      },
    });

    if (!newDocument) throw Error('Error creating document');

    const { fileSize, ...restDocument } = newDocument;

    return restDocument;
  }

  async saveTemplateFileRecord(
    file: Express.Multer.File,
    templateDocumentDto: TemplateDocumentDto,
  ) {
    const { documentTypeId, parentDocumentId, createdBy, ...documentData } =
      templateDocumentDto;
    const secureUrl = `${process.env.HOST_API}/files/template-file/${file.filename}`;

    await this.validateTemplateFileData(templateDocumentDto);

    const originalname = file.originalname.replace(/\s+/g, '-').toLowerCase();

    const creator = await this.user.findUnique({
      where: { username: createdBy },
    });

    if (!creator) throw new Error('Creator User not found');

    const newDocument = await this.document.create({
      data: {
        originalName: originalname,
        fileName: file.filename,
        title: '',
        filePath: secureUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentDate: new Date(),
        receivedDate: new Date(),
        isPrivileged: documentData.isPrivileged || false,
        isEvidence: documentData.isEvidence || false,
        confidentialityLevel: documentData.confidentialityLevel || 'NORMAL',
        versionNumber: +documentData.versionNumber,
        documentType: {
          connect: {
            id: +documentTypeId,
          },
        },
        ...(parentDocumentId && {
          parentDocument: {
            connect: {
              id: +parentDocumentId,
            },
          },
        }),
        creator: {
          connect: {
            id: creator.id,
          },
        },
      },
    });

    if (!newDocument) throw Error('Error creating document');

    const { fileSize, ...restDocument } = newDocument;

    return restDocument;
  }

  async getFileRecord(fileName: string) {
    const fileRecord = await this.document.findFirst({
      where: { fileName: fileName },
    });

    if (!fileRecord) throw new NotFoundException('File not found');

    return fileRecord;
  }

  getProfilePhoto(fileName: string) {
    const path = join(
      __dirname,
      '../../static/uploads/user-profile-photos',
      fileName,
    );

    if (!existsSync(path)) {
      throw new BadRequestException('File not found ' + path);
    }
    return path;
  }

  getCaseFile(fileName: string) {
    const path = join(__dirname, '../../static/uploads/case-files', fileName);
    console.log({ path });
    if (!existsSync(path)) {
      throw new BadRequestException('File not found ' + path);
    }
    return path;
  }

  async getCaseFiles(caseId: string) {
    const files = await this.document.findMany({
      where: { caseId: +caseId },
      // select: {
      //   id: true,
      //   title: true,
      //   filePath: true,
      //   fileName: true,

      // },
    });

    if (!files) throw new NotFoundException('No documents were found');

    const newFiles = files.map((file) => {
      const { fileSize, ...restFile } = file;
      const size = parseInt(file.fileSize.toString()) / 1024;
      return {
        size,
        ...restFile,
      };
    });

    return newFiles;
  }

  async getTemplateFiles() {
    const files = await this.document.findMany({
      where: {
        documentType: {
          category: 'Template',
        },
      },
    });

    if (!files) throw new NotFoundException('No template documents were found');

    const newFiles = files.map((file) => {
      const { fileSize, ...restFile } = file;
      const size = parseInt(file.fileSize.toString()) / 1024;
      return {
        size,
        ...restFile,
      };
    });

    return newFiles;
  }

  getTemplateFile(fileName: string) {
    const path = join(
      __dirname,
      '../../static/uploads/template-files',
      fileName,
    );
    if (!existsSync(path)) {
      throw new BadRequestException('File not found ' + path);
    }
    return path;
  }

  private async validateFileData(caseDocumentDto: CaseDocumentDto) {
    const {
      clientId,
      caseId,
      documentTypeId,
      parentDocumentId,
      createdBy,
      ...documentData
    } = caseDocumentDto;

    const existingClient = await this.client.findUnique({
      where: { id: +clientId },
    });

    if (!existingClient) {
      throw new Error('Client not found');
    }

    const existingCase = await this.case.findUnique({
      where: { id: +caseId },
    });

    if (!existingCase) {
      throw new Error('Case not found');
    }

    const existingDocumentType = await this.documentType.findUnique({
      where: { id: +documentTypeId },
    });

    if (!existingDocumentType) {
      throw new Error('Document type not found');
    }

    if (parentDocumentId) {
      const parentDocument = await this.document.findUnique({
        where: { id: +parentDocumentId },
      });

      if (!parentDocument) {
        throw new Error('Parent Document not found');
      }
    }
  }

  private async validateTemplateFileData(
    templateDocumentDto: TemplateDocumentDto,
  ) {
    const { documentTypeId, parentDocumentId, createdBy, ...documentData } =
      templateDocumentDto;

    const existingDocumentType = await this.documentType.findUnique({
      where: { id: +documentTypeId },
    });

    if (!existingDocumentType) {
      throw new Error('Document type not found');
    }

    if (parentDocumentId) {
      const parentDocument = await this.document.findUnique({
        where: { id: +parentDocumentId },
      });

      if (!parentDocument) {
        throw new Error('Parent Document not found');
      }
    }
  }
}
