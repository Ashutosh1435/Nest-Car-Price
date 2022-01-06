import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../intereceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
// Applying interceptor to the controller itself Bec
// for evenry req inside this controller need to send back the one resp
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  createuser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }
  @Post('/signin')
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // here Serialize is a Interceptor Custom Decorator
  // @Serialize(UserDto)
  @Get('/:id')
  getUsers(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }
  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
  @Get()
  getUser(@Query('email') email: string) {
    // console.log('Inside request Handler(controller)');
    return this.usersService.find(email);
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
