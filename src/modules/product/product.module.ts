import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { product, productSchema } from './schemas/product.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: product.name, schema: productSchema }])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
