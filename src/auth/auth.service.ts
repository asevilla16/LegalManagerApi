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
import { PaginationDto } from '../common/dto/pagination.dto';
import { RegisterUserDto } from './dto/register.dto';

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

  async create(createAuthDto: RegisterUserDto) {
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
        where: { email, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!bcrypt.compareSync(password, passwordHash)) {
        throw new UnauthorizedException('Invalid password');
      }

      if (user) {
        user.lastLogin = new Date();
        await this.user.update({
          where: { id: user.id },
          data: { lastLogin: user.lastLogin },
        });
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

  async createUserByAdmin(createUserDto: CreateUserDto) {
    try {
      const hash = bcrypt.hashSync(createUserDto.password, 10);
      const { passwordHash, ...rest } = await this.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          passwordHash: hash,
          phone: createUserDto.phoneNumber,
          barNumber: createUserDto.barNumber,
          firstName: createUserDto.firstName,
          middleName: createUserDto.middleName,
          lastName: createUserDto.lastName,
          role: createUserDto.role,
          isActive: true,
          isAttorney: !!createUserDto.barNumber,
          barRegistrationDate: new Date(createUserDto.barRegistrationDate),
          createdAt: new Date(),
          lawFirm: { connect: { id: 1 } },
        },
      });
      return rest;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.user.findUnique({ where: { id, isActive: true } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, phoneNumber, barRegistrationDate, ...restBody } =
      updateUserDto;

    let passwordHash: string;

    if (password) {
      passwordHash = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await this.user.update({
      where: { id },
      data: {
        ...restBody,
        ...(passwordHash && { passwordHash }),
        phone: phoneNumber,
        barRegistrationDate: new Date(barRegistrationDate),
        updatedAt: new Date(),
        isActive: true,
      },
    });
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
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

  async getUserById(id: string) {
    try {
      const user = await this.user.findUnique({ where: { id } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { passwordHash, ...rest } = user;

      return {
        ...rest,
        role: rest.role as UserRole,
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

  async getPaginatedUsers(pagination: PaginationDto) {
    const { page, pageSize } = pagination;

    const totalItems = await this.user.count({ where: { isActive: true } });
    const lastPage = Math.ceil(totalItems / pageSize);

    const users = await this.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    console.log({ pageSize, page, totalItems, lastPage });

    return {
      page,
      totalItems,
      lastPage,
      pageSize: users.length,
      data: users,
    };
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
