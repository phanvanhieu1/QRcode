import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!isMongoId(value)) {
      throw new BadRequestException(
        'ID không hợp lệ. Phải là một MongoDB ObjectId.',
      );
    }
    return value;
  }
}
