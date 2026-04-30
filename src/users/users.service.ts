import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type ClaimRewardInput = {
  userId: string;
  points: number;
};

type UpdatePaymentDetailsInput = {
  upiId?: string;
  googlePay?: string;
  phonePe?: string;
  bankHolder?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        mobile: true,
        countryCode: true,
        email: true,
        wallet: true,
        isActive: true,
        createdAt: true,
        upiId: true,
        googlePay: true,
        phonePe: true,
        bankHolder: true,
        bankName: true,
        accountNo: true,
        ifscCode: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        mobile: true,
        countryCode: true,
        email: true,
        wallet: true,
        isActive: true,
        createdAt: true,
        upiId: true,
        googlePay: true,
        phonePe: true,
        bankHolder: true,
        bankName: true,
        accountNo: true,
        ifscCode: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePaymentDetails(id: string, input: UpdatePaymentDetailsInput) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        upiId: input.upiId?.trim() || null,
        googlePay: input.googlePay?.trim() || null,
        phonePe: input.phonePe?.trim() || null,
        bankHolder: input.bankHolder?.trim() || null,
        bankName: input.bankName?.trim() || null,
        accountNo: input.accountNo?.trim() || null,
        ifscCode: input.ifscCode?.trim().toUpperCase() || null,
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        countryCode: true,
        email: true,
        wallet: true,
        isActive: true,
        createdAt: true,
        upiId: true,
        googlePay: true,
        phonePe: true,
        bankHolder: true,
        bankName: true,
        accountNo: true,
        ifscCode: true,
      },
    });

    return {
      message: 'Payment details updated successfully',
      user: updatedUser,
    };
  }

  async claimReward(input: ClaimRewardInput) {
    const points = Number(input.points);

    if (!input.userId || Number.isNaN(points) || points <= 0) {
      throw new BadRequestException('Invalid reward claim data');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: input.userId },
      data: {
        wallet: {
          increment: points,
        },
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        countryCode: true,
        email: true,
        wallet: true,
        isActive: true,
        upiId: true,
        googlePay: true,
        phonePe: true,
        bankHolder: true,
        bankName: true,
        accountNo: true,
        ifscCode: true,
      },
    });

    return {
      message: 'Reward points claimed successfully',
      points,
      wallet: updatedUser.wallet,
      user: updatedUser,
    };
  }
}
