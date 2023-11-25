import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerAuthDto } from './dto/register-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: registerAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: loginAuthDto, @Res() res: Response) {
    const response = await this.authService.login(loginDto);
    res
      .status(HttpStatus.ACCEPTED)
      .header({ Authorization: response.token })
      .send(response.userData);
  }
}
