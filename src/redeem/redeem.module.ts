import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedeemController } from './redeem.controller';
import { RedeemService } from './redeem.service';

@Module({
  imports: [PrismaModule],
  controllers: [RedeemController],
  providers: [RedeemService],
})
export class RedeemModule {}
