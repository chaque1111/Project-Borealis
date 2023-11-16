import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
