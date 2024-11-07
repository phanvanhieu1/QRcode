import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req, UploadedFiles } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { Public } from '@/decorator/customize';
import { Roles } from '@/auth/authorization/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerS3Config } from '@/config/multer.config';





@Controller('product')
export class ProductController {
  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductService,
    
  ) {

  }

  @Post('create')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseInterceptors(FilesInterceptor('images', 10, multerS3Config))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.MulterS3.File[]) {
    createProductDto.images = files.map(file => file.location);
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    
    return this.productService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') _id: string) {
    return this.productService.findOne(_id);
  }

  @Patch()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @UseInterceptors(FilesInterceptor('images', 10, multerS3Config)) 
  async update(
    @Body() updateProductDto: UpdateProductDto,  
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      updateProductDto.images = files.map(file => (file as any).location);
    }
    return this.productService.update(updateProductDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  remove(@Param('id') _id: string) {
    return this.productService.remove(_id);
  }

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Xử lý upload ảnh
    const fileUrl = await this.productService.uploadToS3(file); // Hành động upload đến S3
    return { url: fileUrl }; // Trả về URL ảnh đã upload
  }
}
