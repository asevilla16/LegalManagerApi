import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('get-users')
  getUsers() {
    return this.authService.getUsers();
  }

  @Get('get-user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.findUser(id);
  }

  @Post('update-profile/:id')
  updateProfile(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.updateProfile(id, body);
  }
}
