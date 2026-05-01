import { Injectable, UnauthorizedException } from '@nestjs/common';

type AdminLoginInput = {
  username: string;
  password: string;
};

@Injectable()
export class AdminAuthService {
  private readonly adminUsername = 'admin';
  private readonly adminPassword = 'Aryaadya@2';

  login(input: AdminLoginInput) {
    const username = input.username?.trim();
    const password = input.password?.trim();

    if (username !== this.adminUsername || password !== this.adminPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      success: true,
      message: 'Login successful',
      token: 'gyaanbucks-admin-token',
      admin: {
        username: this.adminUsername,
        role: 'ADMIN',
      },
    };
  }
}
