import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';

import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { Roles } from '@/auth/authorization/roles.decorator';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/decorator/customize';
import { loginQrCodeDto } from './dto/loginqrCode.dto';
import { LocalAuthGuard } from '@/auth/passport/local-auth.guard';
import { ConfigService } from '@nestjs/config';
import { bodyQrCodeDto } from './dto/body.dto';

@Controller('qr-code')
export class QrCodeController {
  constructor(
    private readonly qrCodeService: QrCodeService, 
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
//tạo qr
  @Post('sign-qr')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async generateQrCode(@Query('table') table: string) {
    if (!table) {
      throw new BadRequestException("Table parameter is required")
    }
    const qrCodeDataUrl = await this.qrCodeService.generateQrCode(table);
    const base64Code = qrCodeDataUrl.split(",")[1];
    await this.qrCodeService.saveQr(table, base64Code)
    return base64Code
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
  // @UseGuards(LocalAuthGuard)
  async loginGUEST(
    @Query('table') table: string,
    @Body() body:bodyQrCodeDto 
  ) {
    if (!table) {
      throw new BadRequestException("Table parameter is required")
    }
    return await this.authService.loginGUEST(table,body);
  }

  @Get('login')
  @Public()
  async login(@Query('table') tableId: string) {
    return { message: `Đăng nhập thành công cho bàn ${tableId}` };
  }

  @Get()
  @Roles('EMPLOYEE')
  @UseGuards(RoleGuard)
  findAllTable(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.qrCodeService.findAllTable(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qrCodeService.findOne(+id);
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
