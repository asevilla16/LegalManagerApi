import { Request } from 'express';

export const photosFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) {
    return callback(new Error('No file provided'), false);
  }

  const fileExt = file.mimetype.split('/')[1];
  const allowedMimeTypes = ['jpg', 'jpeg', 'png', 'gif'];

  if (allowedMimeTypes.includes(fileExt)) {
    return callback(null, true);
  }
  callback(null, false);
};

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) {
    return callback(new Error('No file provided'), false);
  }

  const fileExt = file.mimetype.split('/')[1];
  const allowedMimeTypes = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'xls',
    'xlsx',
    'png',
    'jpg',
    'jpeg',
    'gif',
    'vnd.openxmlformats-officedocument.wordprocessingml.document',
    'msword',
    'vnd.ms-excel',
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'plain',
    'csv',
  ];

  console.log({ file });
  console.log({ fileExt });

  if (allowedMimeTypes.includes(fileExt)) {
    return callback(null, true);
  }
  callback(null, false);
};
