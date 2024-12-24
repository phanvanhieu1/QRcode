import { Module } from '@nestjs/common';
import { comboService } from './combo.service';
import { comboController } from './combo.controller';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { combo, comboSchema } from './schemas/combo.schemas';
import { product, productSchema } from '../product/schemas/product.schemas';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([{ name: combo.name, schema: comboSchema }]),
    MongooseModule.forFeature([{ name: product.name, schema: productSchema }]),
  ],
  controllers: [comboController],
  providers: [comboService, ProductService],
})
export class comboModule {}
