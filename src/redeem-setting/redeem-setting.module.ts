import { Module } from '@nestjs/common';
import { RedeemSettingService } from './redeem-setting.service';
import { RedeemSettingController } from './redeem-setting.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RedeemSettingController],
  providers: [RedeemSettingService],
})
export class RedeemSettingModule {}
