import { Request } from 'express';
import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) {
    return callback(new Error('No file provided'), false);
  }
  const fileExt = file.mimetype.split('/')[1];

  const fileName = `${file.originalname.split('.')[0]}-${uuid()}.${fileExt}`;

  callback(null, fileName);
};
