import { Body, Controller, Get, Patch } from '@nestjs/common';
import { RedeemSettingService } from './redeem-setting.service';

@Controller('redeem-setting')
export class RedeemSettingController {
  constructor(private readonly service: RedeemSettingService) {}

  @Get()
  getSettings() {
    return this.service.getSettings();
  }

  @Patch()
  updateSettings(
    @Body()
    body: {
      minimumPoints: number;
      allowedDayOfMonth: number;
    },
  ) {
    return this.service.updateSettings(body);
  }
}
