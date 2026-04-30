import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RedeemService } from './redeem.service';

type CreateRedeemRequestDto = {
  userId: string;
  points: number;
};

type UpdateRedeemStatusDto = {
  status: 'APPROVED' | 'REJECTED';
  adminNote?: string;
};

@Controller('redeem')
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) {}

  @Post('request')
  createRequest(@Body() body: CreateRedeemRequestDto) {
    return this.redeemService.createRequest(body);
  }

  @Get()
  findAll() {
    return this.redeemService.findAll();
  }

  // ✅ NEW — USER HISTORY
  @Get('user/:userId')
  findUserRequests(@Param('userId') userId: string) {
    return this.redeemService.findByUser(userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateRedeemStatusDto) {
    return this.redeemService.updateStatus(id, body);
  }
}
