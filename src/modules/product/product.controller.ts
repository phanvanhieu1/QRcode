import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from '@/auth/authorization/auth.guard';
import { Public } from '@/decorator/customize';
import { Roles } from '@/auth/authorization/roles.decorator';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  create(@Body() createProductDto: CreateProductDto) {
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
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  remove(@Param('id') _id: string) {
    return this.productService.remove(_id);
  }
}
