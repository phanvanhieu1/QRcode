import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { product, productSchema } from './schemas/product.schemas';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forFeature([{ name: product.name, schema: productSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ConfigService],
  exports: [ProductService],
})
export class ProductModule {}
