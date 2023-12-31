import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product, ProductSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule aquí
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWTSECRET'), // Usa el nombre correcto de tu variable de entorno
        signOptions: { expiresIn: '24h' }, // Corrige el formato del tiempo de expiración
      }),
      inject: [ConfigService], // Inyecta ConfigService en el factory
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
