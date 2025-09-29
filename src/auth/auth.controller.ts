import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: RegisterUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('create-user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUserByAdmin(createUserDto);
  }

  @Post('update-user/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('get-users')
  getUsers() {
    return this.authService.getUsers();
  }

  @Get('get-paginated-users')
  getPaginatedUsers(@Query() pagination: PaginationDto) {
    return this.authService.getPaginatedUsers(pagination);
  }

  @Get('get-user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @Post('update-profile/:id')
  updateProfile(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.updateProfile(id, body);
  }
}
