import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';

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

@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService, 
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('generate-login')
  @Public()
  async generateLoginQrCode(@Body('username') username: string) {
    const baseUrl = this.configService.get<string>('BASE_URL'); // Lấy giá trị BASE_URL từ biến môi trường
    const loginUrl = `${baseUrl}/v1/qr-code/login?username=${username}`; // Tạo URL động
    return await this.qrCodeService.generateQrCode(loginUrl);  // Tạo mã QR chứa URL
  }

  @Post('create')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  async create(@Body() data: CreateQrCodeDto) {
    return await this.qrCodeService.create(data);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async loginGuess(@Request() req) {
    console.log(req.user.username)
    return await this.authService.loginGuess(req.user); 
  }

  @Get()
  findAll() {
    return this.qrCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qrCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQrCodeDto: UpdateQrCodeDto) {
    return this.qrCodeService.update(+id, updateQrCodeDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  remove(@Param('id') _id: string) {
    return this.qrCodeService.remove(_id);
  }
}
