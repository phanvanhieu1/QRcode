import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';

@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post()
  create(@Body() createQrCodeDto: CreateQrCodeDto) {
    return this.qrCodeService.create(createQrCodeDto);
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
  remove(@Param('id') id: string) {
    return this.qrCodeService.remove(+id);
  }
}
