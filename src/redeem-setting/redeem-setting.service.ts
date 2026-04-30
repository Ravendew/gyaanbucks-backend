import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedeemSettingService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let setting = await this.prisma.redeemSetting.findFirst();

    // If not exists, create default
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

  async updateSettings(data: {
    minimumPoints: number;
    allowedDayOfMonth: number;
  }) {
    const existing = await this.prisma.redeemSetting.findFirst();

    if (!existing) {
      return this.prisma.redeemSetting.create({
        data,
      });
    }

    return this.prisma.redeemSetting.update({
      where: { id: existing.id },
      data,
    });
  }
}
