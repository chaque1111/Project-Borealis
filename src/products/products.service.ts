import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { HTTPResponse } from 'puppeteer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    //Remove Tildes
    function removeTildes(texto: string): string {
      const tildes = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        Á: 'A',
        É: 'E',
        Í: 'I',
        Ó: 'O',
        Ú: 'U',
      };
      return texto.replace(/[áéíóúÁÉÍÓÚ]/g, (letra) => tildes[letra]);
    }
    const product = await this.ProductModel.find({
      name: removeTildes(createProductDto.name),
    });
    if (product.length)
      throw new HttpException(
        'Ya existe un producto con ese nombre',
        HttpStatus.CONFLICT,
      );
    else
      this.ProductModel.create({
        ...createProductDto,
        name: removeTildes(createProductDto.name),
      });
    return 'El producto se creó correctamente';
  }

  async findAll(query: object) {
    const productsPerPage = 10;
    const page = query['currentPage'] || 1;
    const skip = productsPerPage * (page - 1);
    //Search by Name
    if (query['name']) {
      //Remove Tildes Function
      function removeTildes(texto: string): string {
        const tildes = {
          á: 'a',
          é: 'e',
          í: 'i',
          ó: 'o',
          ú: 'u',
          Á: 'A',
          É: 'E',
          Í: 'I',
          Ó: 'O',
          Ú: 'U',
        };
        return texto.replace(/[áéíóúÁÉÍÓÚ]/g, (letra) => tildes[letra]);
      }

      return await this.ProductModel.find({
        name: { $regex: new RegExp(removeTildes(query['name']), 'i') },
      });
    }
    return await this.ProductModel.find().limit(productsPerPage).skip(skip);
  }

  async findOne(id: string) {
    const product = (await this.ProductModel.findById(id)) || null;
    if (product) {
      return product;
    } else {
      throw new HttpException(
        'El producto no ha sido encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updateProduct = await this.ProductModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );
    if (!updateProduct) {
      throw new HttpException(
        'El producto no se encontró',
        HttpStatus.NOT_FOUND,
      );
    }
    return 'El producto se modificó exitosamente';
  }

  async remove(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product) {
      throw new HttpException(
        'El producto no se encontró o ya fué eliminado',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.ProductModel.findByIdAndRemove(id);
    return `El producto se eliminó correctamente`;
  }
}
