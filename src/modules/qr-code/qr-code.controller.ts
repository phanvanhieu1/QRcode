import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { Roles } from '@/auth/authorization/roles.decorator';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/decorator/customize';
import { bodyQrCodeDto } from './dto/body.dto';

@Controller('qr-code')
export class QrCodeController {
  constructor(
    private readonly qrCodeService: QrCodeService,
    private readonly authService: AuthService,
  ) {}
  //tạo qr
  @Post('sign-qr')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async generateQrCode(@Query('table') table: string) {
    if (!table) {
      throw new BadRequestException('Table parameter is required');
    }
    const qrCodeDataUrl = await this.qrCodeService.generateQrCode(table);
    const base64Code = qrCodeDataUrl.split(',')[1];
    await this.qrCodeService.saveQr(table, base64Code);
    return base64Code;
  }
  //tạo bàn
  @Post('create')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async create(@Body() data: CreateQrCodeDto) {
    return await this.qrCodeService.create(data);
  }

  @Post('login')
  @Public()
  async loginGUEST(@Query('table') table: string, @Body() body: bodyQrCodeDto) {
    if (!table) {
      throw new BadRequestException('Table parameter is required');
    }
    const token = await this.authService.loginGUEST(table, body);
    return token;
  }

  @Get('login')
  @Public()
  async login(@Query('table') tableId: string, @Res() res: Response) {
    return res.redirect('https://www.facebook.com');
  }

  @Get('detailQr/:table')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  findOne(@Param('table') table: string) {
    return this.qrCodeService.findOne(table);
  }

  @Get('allQr')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  findallQr() {
    return this.qrCodeService.findallQr();
  }

  @Get()
  @Roles('EMPLOYEE', 'ADMIN')
  @UseGuards(RoleGuard)
  findAllTable(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.qrCodeService.findAllTable(query, +current, +pageSize);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQrCodeDto: UpdateQrCodeDto) {
    return this.qrCodeService.update(+id, updateQrCodeDto);
  }
  //xoá bàn
  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  removeTable(@Param('id') _id: string) {
    return this.qrCodeService.removeTable(_id);
  }

  //xoá qr
  @Delete('delqr/:id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  removeqr(@Param('id') _id: string) {
    return this.qrCodeService.removeqr(_id);
  }
}
