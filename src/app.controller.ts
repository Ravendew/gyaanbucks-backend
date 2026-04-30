import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return 'GyaanBucks API Running';
  }

  @Get('admin/stats')
  async getStats() {
    const totalQuizzes = await this.prisma.quiz.count();

    const activeQuizzes = await this.prisma.quiz.count({
      where: { isActive: true },
    });

    const totalUsers = await this.prisma.user.count();

    const totalPoints = await this.prisma.user.aggregate({
      _sum: {
        wallet: true,
      },
    });

    const pendingRedeems = await this.prisma.redeemRequest.count({
      where: { status: 'PENDING' },
    });

    return {
      totalQuizzes,
      activeQuizzes,
      totalUsers,
      totalPoints: totalPoints._sum.wallet || 0,
      pendingRedeems,
    };
  }
}
