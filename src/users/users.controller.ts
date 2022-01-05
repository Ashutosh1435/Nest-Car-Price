import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  createuser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }
  @Get('/allUsers')
  getUsers() {
    return this.usersService.findAll();
  }
  @Get('/allUsers/:id')
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Patch('/:id')
  updateuUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
