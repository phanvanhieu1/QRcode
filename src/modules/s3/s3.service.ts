import { Inject, Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(@Inject('S3_CLIENT') private readonly s3Client: S3Client) {}

  public getMulterS3Config() {
    if (!this.s3Client) {
      return ""
    }
    return multer({
      storage: multerS3({
        s3: this.s3Client,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) => {
          const fileName = `${uuidv4()}-${file.originalname}`;
          cb(null, `products/${fileName}`);
        },
      }),
    });
  }
}
