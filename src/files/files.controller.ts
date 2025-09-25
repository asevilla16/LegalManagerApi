import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, photosFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CaseDocumentDto } from './dto/case-document.dto';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('user-profile-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: photosFilter,
      storage: diskStorage({
        destination: './static/uploads/user-profile-photos',
        filename: fileNamer,
      }),
    }),
  )
  uploadProfilePhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/avatar/${file.filename}`;
    return {
      // fileName: file.filename,
      secureUrl,
    };
  }

  @Post('case-file')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads/case-files',
        filename: fileNamer,
      }),
    }),
  )
  uploadCaseFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CaseDocumentDto,
  ) {
    console.log({ fileFromFrontend: file, body });

    if (!file) {
      throw new BadRequestException(
        'Make sure that the file is a valid document type',
      );
    }

    const fileRecord = this.filesService.saveFileRecord(file, body);

    if (!fileRecord) {
      throw new BadRequestException('Error creating file record');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/case-file/${file.filename}`;
    return fileRecord;
  }

  @Get('avatar/:fileName')
  getProfilePhoto(@Res() res: Response, @Param('fileName') fileName: string) {
    const path = this.filesService.getProfilePhoto(fileName);
    res.sendFile(path);
  }

  @Get('case-file/:fileName')
  getCaseFile(@Res() res: Response, @Param('fileName') fileName: string) {
    const path = this.filesService.getCaseFile(fileName);
    res.sendFile(path);
  }

  @Get('case-file/documents-by-case/:caseId')
  getDocumentsByCase(@Param('caseId') caseId: string) {
    const docs = this.filesService.getCaseFiles(caseId);
    return docs;
  }
}
