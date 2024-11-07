import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { product, productSchema } from './schemas/product.schemas';
import { S3Module } from '../s3/s3.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forFeature([{ name: product.name, schema: productSchema }]),
    S3Module,
  ],
  controllers: [ProductController],
  providers: [ProductService, ConfigService],
  exports: [ProductService],
})
export class ProductModule {}
