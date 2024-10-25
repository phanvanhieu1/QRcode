import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { user } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helper/util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user.name) 
    private userModel: Model<user>
  ) {}
  
  async create(createUser: CreateUserDto) {
    const {username, password} = createUser
    const hashpassword = await hashPasswordHelper(createUser.password)
    const user = await this.userModel.create({
      username,  
      password: hashpassword
    })
    return {
      _id: user._id
    }
  }

  async check(table: string) {
    const rs = await this.userModel.findOne({username: table})
    return rs
  }

  async createTable(data: any) {
    return await this.userModel.create({
      username: data.tableNumber,
      password: data.password
    })
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByUsername(username: string) {
    const rs =  await this.userModel.findOne({username})
    return rs
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
