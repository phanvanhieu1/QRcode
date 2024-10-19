import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { product } from './schemas/product.schemas';
import aqp from 'api-query-params';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(product.name) 
    private productModel: Model<product>
  ) {}

  isProductNameExist = async  (name: string) => {
    const product = await this.productModel.exists({
      name
    });
    if (product) return true;
    return false
  }
  async create(createProductDto: CreateProductDto) {
    const {
      name,
      nameEng, 
      nameSlug, 
      nameSearch, 
      nameSearchEng, 
      description, 
      price, 
      status, 
      image   
      } = createProductDto
      const isExist = await this.isProductNameExist(name);
      if(isExist === true) {
        throw new BadRequestException(`món: ${name} đã có, vui lòng kiểm tra lại`)
      }
      const product = await this.productModel.create({
      name,
      nameEng, 
      nameSlug, 
      nameSearch, 
      nameSearchEng, 
      description, 
      price, 
      status, 
      image  
      })
      return {
        _id: product._id
      }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} =  aqp(query);
    if(filter.current) delete filter.current;
    if(filter.pageSize) delete filter.pageSize;

    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);
    const rs = await this.productModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select("-nameSlug")
    .select("-nameSearch")
    .select("-nameSearchEng")
    .sort(sort as any)
    return {rs, totalPages}; 
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
