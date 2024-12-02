import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { Roles } from '@/auth/authorization/roles.decorator';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerS3Config } from '@/config/multer.config';
import { MongoIdPipe } from '@/helper/mongo-id.pipe.ts';

@Controller('combo')
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post('create')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseInterceptors(FilesInterceptor('images', 10, multerS3Config))
  async create(
    @Body() createComboDto: CreateComboDto,
    @UploadedFiles() files: Express.MulterS3.File[],
    @Req() req,
  ) {
    if (files && files.length > 0) {
      createComboDto.images = files.map((file) => (file as any).location);
    }
    return this.comboService.createCombo(createComboDto);
  }

  @Get()
  @Roles('ADMIN', 'EMPLOYEE', 'GUEST')
  @UseGuards(RoleGuard)
  findAll(@Req() req) {
    return this.comboService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.comboService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EMPLOYEE')
  @UseGuards(RoleGuard)
  @UseInterceptors(FilesInterceptor('images', 10, multerS3Config))
  async update(
    @Param('id') id: string,
    @Body() updateComboDto: UpdateComboDto,
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      updateComboDto.images = files.map((file) => (file as any).location);
    }
    return this.comboService.update(id, updateComboDto, req.user.role);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.comboService.remove(id);
  }

  @Post('deleteall')
  @Roles('ADMIN', 'EMPLOYEE', 'GUEST')
  @UseGuards(RoleGuard)
  removeAll() {
    return this.comboService.removeAll();
  }
}
