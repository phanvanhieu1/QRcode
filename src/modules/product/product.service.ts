import mongoose, { Model } from 'mongoose';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { product } from './schemas/product.schemas';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import { ProductCategory } from '@/decorator/enum';

@Injectable()
export class ProductService {
  private s3: S3Client;
  constructor(
    @InjectModel(product.name)
    private productModel: Model<product>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  isProductNameExist = async (name: string) => {
    const product = await this.productModel.exists({
      name,
    });
    if (product) return true;
    return false;
  };
  async create(createProductDto: CreateProductDto) {
    const {
      name,
      nameEng,
      nameSlug,
      nameSearch,
      nameSearchEng,
      description,
      price,
      category,
      images,
    } = createProductDto;
    const isExist = await this.isProductNameExist(name);
    if (isExist === true) {
      throw new BadRequestException(
        `món: ${name} đã có, vui lòng kiểm tra lại`,
      );
    }
    const canBeReturned =
      category === ProductCategory.BOTTLED_DRINKS ? true : false;
    const product = await this.productModel.create({
      name,
      nameEng,
      nameSlug,
      nameSearch,
      nameSearchEng,
      description,
      price,
      category,
      canBeReturned,
      images,
    });
    return {
      _id: product._id,
      name: product.name,
      images: product.images,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const rs = await this.productModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-nameSlug')
      .select('-nameSearch')
      .select('-nameSearchEng')
      .sort(sort as any);
    return { rs, totalPages };
  }

  async findOne(_id: string) {
    return await this.productModel.findById({ _id });
  }

  async update(updateProductDto: UpdateProductDto) {
    const { _id, ...updateData } = updateProductDto;

    const product = await this.productModel.findById(_id);
    if (!product) {
      throw new BadRequestException(`Món có ID: ${_id} không tồn tại`);
    }
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      _id,
      { ...updateProductDto },
      { new: true },
    );
    let a: boolean;
    const b = updatedProduct.category === ProductCategory.BOTTLED_DRINKS;
    if (b) a = true;
    else a = false;
    const rs = await this.productModel.findByIdAndUpdate(
      _id,
      { canBeReturned: a },
      { new: true },
    );
    return rs;
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.productModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('id không đúng định dạng');
    }
  }
}
