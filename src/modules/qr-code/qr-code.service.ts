import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { qrCode } from './schemas/qrCode.schemas';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helper/util';
import { UserService } from '../user/user.service';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectModel(qrCode.name) 
    private qrCodeModel: Model<qrCode>,
    private userService: UserService
  ) {}
  isqrCodeExist = async (tableNumber: string) => {
    const table = await this.userService.check(
      tableNumber
    );
    return !!table;
  }

  async generateQrCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url); // Tạo mã QR và trả về dưới dạng Base64
    } catch (err) {
      throw new Error('Không thể tạo mã QR');
    }
  }

  // async generateQRCode(url: string): Promise<string> {
  //   try {
  //     const qrCodeDataUrl = await QRCode.toDataURL(url);
  //     return qrCodeDataUrl; // Trả về URL của mã QR
  //   } catch (error) { 
  //     throw new Error('Failed to generate QR Code');
  //   }
  // }

  async create(data: CreateQrCodeDto) {
    const {tableNumber} = data
    const isExist = await this.isqrCodeExist(tableNumber);
    const hashpassword = await hashPasswordHelper('123')
      if(isExist === true) {
        throw new BadRequestException(`bàn: ${tableNumber} đã có, vui lòng kiểm tra lại`)
      }
    const rs = await this.userService.createTable({
      password:hashpassword,
      tableNumber,
    })
    return {
      _id: rs.id
    }
  }

  async findByNumberTable (numTable: string) {
    return await this.qrCodeModel.findOne ({numTable})
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

  async remove(_id: string) {
    if(mongoose.isValidObjectId(_id)) {
      return await this.qrCodeModel.deleteOne({_id})
    } else {
      throw new BadRequestException("id không đúng định dạng")
    }
  }
}
