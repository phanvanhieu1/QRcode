// src/config/multer.config.ts
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import * as multer from 'multer';
import { extname } from 'path';
import { config } from 'dotenv';
import { BadRequestException } from '@nestjs/common';
config();
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
export const multerS3Config = {
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = `${Date.now().toString()}-${file.originalname.replace(/\s+/g, '')}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new BadRequestException("ảnh không đúng định dạng"), false);
    }
    cb(null, true);
  },
};
