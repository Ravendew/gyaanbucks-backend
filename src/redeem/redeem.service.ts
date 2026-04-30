import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CreateRedeemRequestInput = {
  userId: string;
  points: number;
};

type UpdateRedeemStatusInput = {
  status: 'APPROVED' | 'REJECTED';
  adminNote?: string;
};

@Injectable()
export class RedeemService {
  constructor(private readonly prisma: PrismaService) {}

  private async getRedeemSettings() {
    let setting = await this.prisma.redeemSetting.findFirst();

    if (!setting) {
      setting = await this.prisma.redeemSetting.create({
        data: {
          minimumPoints: 5000,
          allowedDayOfMonth: 5,
        },
      });
    }

    return setting;
  }

  async createRequest(input: CreateRedeemRequestInput) {
    const points = Number(input.points);

    if (!input.userId || Number.isNaN(points) || points <= 0) {
      throw new BadRequestException('Invalid redeem request');
    }

    const setting = await this.getRedeemSettings();

    if (points < setting.minimumPoints) {
      throw new BadRequestException(
        `Minimum redeem is ${setting.minimumPoints} points`,
      );
    }

    const today = new Date();
    const day = today.getDate();

    if (day !== setting.allowedDayOfMonth) {
      throw new BadRequestException(
        `Redeem allowed only on ${setting.allowedDayOfMonth}${this.getDaySuffix(
          setting.allowedDayOfMonth,
        )}`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.wallet < points) {
      throw new BadRequestException('Not enough points');
    }

    const amount = points / 100;

    await this.prisma.user.update({
      where: { id: input.userId },
      data: {
        wallet: {
          decrement: points,
        },
      },
    });

    const request = await this.prisma.redeemRequest.create({
      data: {
        userId: input.userId,
        points,
        amount,
        status: 'PENDING',
      },
    });

    return {
      message: 'Redeem request submitted',
      request,
    };
  }

  async findAll() {
    return this.prisma.redeemRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            mobile: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.redeemRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, input: UpdateRedeemStatusInput) {
    const request = await this.prisma.redeemRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return this.prisma.redeemRequest.update({
      where: { id },
      data: {
        status: input.status,
        adminNote: input.adminNote || null,
      },
    });
  }

  private getDaySuffix(day: number) {
    if (day >= 11 && day <= 13) return 'th';

    const lastDigit = day % 10;

    if (lastDigit === 1) return 'st';
    if (lastDigit === 2) return 'nd';
    if (lastDigit === 3) return 'rd';

    return 'th';
  }
}
