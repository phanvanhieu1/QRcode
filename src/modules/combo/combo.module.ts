import { Module } from '@nestjs/common';
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Combo, ComboSchema } from './schemas/combo.schemas';
import { product, productSchema } from '../product/schemas/product.schemas';

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([{ name: Combo.name, schema: ComboSchema }]),
    MongooseModule.forFeature([{ name: product.name, schema: productSchema }]),
  ],
  controllers: [ComboController],
  providers: [ComboService, ProductService],
})
export class ComboModule {}
