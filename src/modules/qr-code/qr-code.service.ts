import { Injectable } from '@nestjs/common';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';

@Injectable()
export class QrCodeService {
  create(createQrCodeDto: CreateQrCodeDto) {
    return 'This action adds a new qrCode';
  }

  findAll() {
    return `This action returns all qrCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qrCode`;
  }

  update(id: number, updateQrCodeDto: UpdateQrCodeDto) {
    return `This action updates a #${id} qrCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} qrCode`;
  }
}
