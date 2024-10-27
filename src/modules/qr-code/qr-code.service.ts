import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
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

  

  async generateQrCode(tableId: string): Promise<string> {
    const url = `https://qrcode-awav.onrender.com/api/v1/qr-code/login?table=${tableId}`;
    return await QRCode.toDataURL(url); // Trả về QR dưới dạng Data URL (base64 image)
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

  // async findByNumberTable (numTable: string) {
  //   return await this.qrCodeModel.findOne ({numTable})
  // }
 
  findAllTable(query: string, current: number, pageSize: number) {
    return this.userService.findAllTable(query, current, pageSize)
  }

  findOne(id: number) {
    return `This action returns a #${id} qrCode`;
  }

  update(id: number, updateQrCodeDto: UpdateQrCodeDto) {
    return `This action updates a #${id} qrCode`;
  }

  isqrCodeExist2 = async (_id: string) => {
    const table = await this.userService.checkUser(
      _id
    );
    return table;
  }

  async removeTable(_id: string) {
    if(mongoose.isValidObjectId(_id)) {
      const rs = await this.isqrCodeExist2(_id)
      if(!rs) {
        throw new BadRequestException(`bàn này không tồn tại`)
      }
      await this.userService.deleteTable(_id)
        return {
          statusCode: HttpStatus.OK, // Có thể chỉ định mã trạng thái
          message: `đã xoá qr bàn số ${rs.username}`,
      }
    } else {
      throw new BadRequestException("id không đúng định dạng")
    }
  }

  checkQr1 = async (_id: string) => {
    const table =await this.qrCodeModel.findOne({_id: _id})
    return table
  }

  async removeqr(_id: string) {
    if(mongoose.isValidObjectId(_id)) {
      const rs = await this.checkQr1(_id)
      if(!rs) {
        throw new BadRequestException("không tồn tại qr này")
      }
      await this.qrCodeModel.deleteOne({_id})
      return {
        statusCode: HttpStatus.OK, // Có thể chỉ định mã trạng thái
        message: `đã xoá qr bàn số ${rs.tableNumber}`,
        data: {rs}
    }
    } else {
      throw new BadRequestException("id không đúng định dạng")
    }
  }

  checkQr = async (num: string) => {
    const table =await this.qrCodeModel.findOne({tableNumber: num})
    return table
  }


  async saveQr(tableNumber: string, code: string) {
    const checkTable = await this.isqrCodeExist(tableNumber)
    const rs = await this.checkQr(tableNumber)
    if(!checkTable) {
      throw new BadRequestException(`không tìm thấy bàn số ${tableNumber}, vui lòng tạo bàn số ${tableNumber} trước`)
    }
    else if(rs) {
      throw new BadRequestException(`bàn số ${tableNumber} đã có mã qr, vui lòng thử lại`)
    }
    const qr = await this.qrCodeModel.create({
      tableNumber: tableNumber,
      code: code
    })
    return qr
  }
}
