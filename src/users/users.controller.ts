import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { favoriteDto } from './dto/add-favorite.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: Request) {
    const user = request['user'];

    return this.usersService.findAll(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @UseGuards(AuthGuard)
  @Get('favorite')
  getAllFavorites(@Req() request: Request) {
    return this.usersService.getAllFavorites(request['user']);
  }
  @UseGuards(AuthGuard)
  @Post('favorite')
  addFavoriteProduct(
    @Body() favoriteDto: favoriteDto,
    @Req() request: Request,
  ) {
    return this.usersService.addFavoriteProduct(favoriteDto, request['user']);
  }

  @UseGuards(AuthGuard)
  @Delete('favorite')
  deleteFavoriteProduct(
    @Body() favoriteDto: favoriteDto,
    @Req() request: Request,
  ) {
    return this.usersService.deleteFavoriteProduct(
      favoriteDto,
      request['user'],
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
