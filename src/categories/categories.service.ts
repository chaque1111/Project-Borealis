import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, user: object) {
    if (user['admin']) {
      const checkoIfExist = await this.categoryModel.find({
        name: { $regex: `^${createCategoryDto.name}$`, $options: 'i' },
      });
      if (checkoIfExist.length) {
        throw new HttpException(
          'Ésta categoría ya existe',
          HttpStatus.CONFLICT,
        );
      } else {
        await this.categoryModel.create(createCategoryDto);
        return '!La categoría se creó exitosamente!';
      }
    } else throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: object) {
    if (!user['admin']) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    } else {
      try {
        await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
          new: true,
        });
        return 'La categoría se modificó exitosamente';
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
      }
    }
  }

  async remove(id: string, user: object) {
    if (!user['admin']) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    } else {
      try {
        const product = await this.categoryModel.findById(id);
        if (!product) {
          throw new HttpException(
            'La categoría no se encontró, o ya se eliminó anteriormente',
            HttpStatus.NOT_FOUND,
          );
        } else {
          await this.categoryModel.findByIdAndRemove(id);
          return 'La categoría se eliminó exitosamente';
        }
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
      }
    }
  }
}
