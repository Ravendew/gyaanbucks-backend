import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';

type ClaimRewardDto = {
  userId: string;
  points: number;
};

type UpdatePaymentDetailsDto = {
  upiId?: string;
  googlePay?: string;
  phonePe?: string;
  bankHolder?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('claim-reward')
  claimReward(@Body() body: ClaimRewardDto) {
    return this.usersService.claimReward(body);
  }

  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('payment-details/:id')
  updatePaymentDetails(
    @Param('id') id: string,
    @Body() body: UpdatePaymentDetailsDto,
  ) {
    return this.usersService.updatePaymentDetails(id, body);
  }
}
