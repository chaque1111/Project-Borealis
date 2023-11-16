import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { registerAuthDto } from './dto/register-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModule: Model<User>,
    private jwtService: JwtService,
  ) {}
  async register(registerDto: registerAuthDto) {
    const userExist = await this.UserModule.findOne({
      email: registerDto.email,
    });
    if (!userExist) {
      const plainToHash = await hash(registerDto.password, 12);
      this.UserModule.create({
        ...registerDto,
        password: plainToHash,
      });
      return '¡La cuenta se creó correctamente!';
    } else {
      throw new HttpException(
        'Ya existe una cuenta asociada al mismo correo electrónico',
        HttpStatus.CONFLICT,
      );
    }
  }

  async login(loginDto: loginAuthDto) {
    const user = await this.UserModule.findOne({
      email: loginDto.email,
    });
    if (!user) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    } else {
      const checkPass = await compare(loginDto.password, user.password);
      if (checkPass) {
        const userData = {
          id: user._id,
          username: user.username,
          email: user.email,
          admin: user.admin,
        };
        const token = await this.jwtService.signAsync(userData);
        return {
          token,
          userData,
        };
      } else {
        throw new HttpException(
          'correo electrónico o contraseña incorrecta',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
