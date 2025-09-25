import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/auth.entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  private readonly logger = new Logger(AuthService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('AuthService initialized');
  }

  async create(createAuthDto: CreateUserDto) {
    try {
      const hash = bcrypt.hashSync(createAuthDto.password, 10);
      const { passwordHash, ...rest } = await this.user.create({
        data: {
          username: createAuthDto.username,
          email: createAuthDto.email,
          passwordHash: hash,
          firstName: createAuthDto.firstName,
          lastName: createAuthDto.lastName,
          role: createAuthDto.role,
          isActive: true,
          createdAt: new Date(),
        },
      });
      return rest;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const { passwordHash, ...user } = await this.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!bcrypt.compareSync(password, passwordHash)) {
        throw new UnauthorizedException('Invalid password');
      }

      return {
        ...user,
        role: user.role as UserRole,
        token: this.getJwtToken({ id: user.id, email: user.email }),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async findUser(id: string) {
    try {
      const user = await this.user.findUnique({ where: { id } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        ...user,
        role: user.role as UserRole,
      };
    } catch (error) {
      console.log('Error finding user: ', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await this.user.findMany();

      return users.map(({ passwordHash, ...user }) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
      }));
    } catch (error) {
      console.log('Error getting users: ', error);
      throw error;
    }
  }

  async updateProfile(id: string, body: UpdateUserDto) {
    const user = await this.user.findUnique({ where: { id, isActive: true } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...restBody } = body;

    let passwordHash: string;

    if (password) {
      passwordHash = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await this.user.update({
      where: { id },
      data: {
        ...restBody,
        ...(passwordHash && { passwordHash }),
        updatedAt: new Date(),
        isActive: true,
      },
    });
  }
}
