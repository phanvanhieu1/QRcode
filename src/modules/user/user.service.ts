import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { user } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helper/util';
import aqp from 'api-query-params';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user.name)
    private userModel: Model<user>,
  ) {}

  async create(createUser: CreateUserDto) {
    const { username, password, role } = createUser;
    const hashpassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      role: role,
      username,
      password: hashpassword,
    });
    return {
      _id: user._id,
    };
  }

  async check(table: string) {
    const rs = await this.userModel.findOne({ username: table });
    return rs;
  }

  async checkUser(_id: string) {
    const rs = await this.userModel.findOne({ _id: _id });
    return rs;
  }

  async deleteTable(_id: string) {
    const rs = await this.userModel.deleteOne({ _id: _id });
    return rs;
  }

  async createTable(data: any) {
    return await this.userModel.create({
      username: data.tableNumber,
      password: data.password,
    });
  }

  async findAllTable(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    filter.role = 'GUEST';
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const rs = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .select('-role')
      .select('-password');

    const result = rs.map((item) => {
      const { username, ...rest } = item.toObject();
      return { bàn: username, ...rest };
    });

    return { result, totalPages };
  }

  async findByUsername(username: string) {
    const rs = await this.userModel.findOne({ username });
    return rs;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
