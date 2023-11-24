import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { filterProductDto } from './dto/filter-product.dto';
import { UploadService } from 'src/upload/upload.service';
import * as crypto from 'crypto';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly ProductModel: Model<Product>,
    private readonly uploadService: UploadService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: object,
    files: Express.Multer.File[],
  ) {
    //Check admin
    if (!user['admin'])
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    else {
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
      else {
        const images: string[] = [];

        //Upload images to s3 bucket aws
        for (const element of files['images']) {
          let randomImageName = crypto.randomBytes(16).toString('hex');
          images.push(randomImageName);
          await this.uploadService.upload(
            randomImageName,
            element.buffer,
            element.mimetype,
          );
        }
        this.ProductModel.create({
          ...createProductDto,
          name: removeTildes(createProductDto.name),
          image: images,
        });
        return 'El producto se creó correctamente';
      }
    }
  }

  async findAll(query: object, filterDto: filterProductDto) {
    const page = query['currentPage'] || 1;
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    if (
      !query['name'] &&
      !filterDto.color &&
      !filterDto.price &&
      !filterDto.size
    ) {
      const productsDb = await this.ProductModel.find().skip(skip).limit(limit);
      const productsSigned = [];
      for (const element of productsDb) {
        const imageSigned = await this.uploadService.getImages(
          element.image[0],
        );
        productsSigned.push({
          ...element['_doc'],
          image: imageSigned,
        });
      }
      return productsSigned;
    } else {
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
      let conditions: any = {};

      if (query['name']) {
        const name = removeTildes(query['name']);
        conditions.name = { $regex: name, $options: 'i' };
      }

      if (filterDto.color) {
        conditions.color = filterDto.color;
      }

      if (filterDto.size) {
        conditions.size = filterDto.size;
      }
      if (
        filterDto.price &&
        (filterDto.price['min'] || filterDto.price['max'])
      ) {
        conditions.price = {
          $lte: filterDto.price['max'],
          $gte: filterDto.price['min'],
        };
      }
      const productsDb = await this.ProductModel.find(conditions)
        .skip(skip)
        .limit(limit);
      const productsSigned = [];
      for (const element of productsDb) {
        const imageSigned = await this.uploadService.getImages(
          element.image[0],
        );
        productsSigned.push({
          ...element['_doc'],
          image: imageSigned,
        });
      }
      return productsSigned;
    }
  }

  async findOne(id: string) {
    const product = (await this.ProductModel.findById(id)) || null;
    if (product) {
      const image: string[] = [];
      for (const element of product.image) {
        let imageSigned = await this.uploadService.getImages(element);
        image.push(imageSigned);
      }
      return {
        ...product['_doc'],
        image: image,
      };
    } else {
      throw new HttpException(
        'El producto no ha sido encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: object) {
    if (!user['admin'])
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
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

  async remove(id: string, user: object) {
    if (user['admin']) {
      const product = await this.ProductModel.findById(id);
      if (!product) {
        throw new HttpException(
          'El producto no se encontró o ya fué eliminado',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.ProductModel.findByIdAndRemove(id);
      return `El producto se eliminó correctamente`;
    } else throw new HttpException('UNATHORIZED', HttpStatus.UNAUTHORIZED);
  }
}
