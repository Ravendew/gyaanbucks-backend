import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(body: any) {
    const { name, countryCode, mobile, email, password } = body;

    if (!name || !mobile || !password) {
      throw new BadRequestException('Name, mobile and password are required');
    }

    const existingMobile = await this.prisma.user.findUnique({
      where: { mobile },
    });

    if (existingMobile) {
      throw new BadRequestException('Mobile number already registered');
    }

    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already registered');
      }
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        countryCode: countryCode || '+91',
        mobile,
        email: email || null,
        password,
      },
    });

    const { password: _password, ...safeUser } = user;

    return {
      message: 'User registered successfully',
      user: safeUser,
    };
  }

  async login(body: any) {
    const { identifier, mobile, email, password } = body;

    const loginValue = identifier || mobile || email;

    if (!loginValue || !password) {
      throw new BadRequestException('Phone or email and password are required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ mobile: loginValue }, { email: loginValue }],
      },
    });

    if (!user || user.password !== password) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new BadRequestException('Your account is inactive');
    }

    const { password: _password, ...safeUser } = user;

    return {
      message: 'Login successful',
      user: safeUser,
    };
  }
}
