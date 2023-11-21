import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { favoriteDto } from './dto/add-favorite.dto';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModule: Model<User>,
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,
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

  async getAllFavorites(user: object) {
    let userDb = await this.UserModule.findById(user['id'], {
      favorites: true,
    });
    if (!userDb) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    } else {
      const arrayFav = Promise.all(
        userDb.favorites.map(
          async (e) =>
            await this.ProductModel.findById(e, {
              image: true,
              name: true,
              price: true,
              discount: true,
              quota: true,
            }),
        ),
      );
      return arrayFav;
    }
  }
  async addFavoriteProduct(favDto: favoriteDto, user: object) {
    let userDb = await this.UserModule.findById(user['id']);
    let productDb = await this.ProductModel.findById(favDto.productId);
    if (!userDb || !productDb) {
      throw new HttpException(
        'El usuario o el producto no existe',
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (userDb.favorites.includes(favDto.productId)) {
        throw new HttpException(
          'El producto ya está en favoritos',
          HttpStatus.CONFLICT,
        );
      }
      userDb.favorites.push(favDto.productId);
      userDb.save();
      return 'El producto se agregó a favoritos exitosamente';
    }
  }

  async deleteFavoriteProduct(favoriteDto: favoriteDto, user: object) {
    let userDb = await this.UserModule.findById(user['id']);
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    } else {
      userDb.favorites = userDb.favorites.filter(
        (e) => e !== favoriteDto.productId,
      );

      await userDb.save();
      return 'El producto se eliminó de favoritos';
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
