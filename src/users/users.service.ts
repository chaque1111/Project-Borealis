import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModule: Model<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  async findAll(user: object) {
    const userDb = await this.UserModule.findOne({ email: user['email'] });
    if (userDb.admin)
      return await this.UserModule.find({ email: { $ne: user['email'] } });
    else throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
