import { Controller, Get, Post, Query, Body, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './payment.dto';

@Controller('payment')// định nghĩa route ng dùng chọc vAO
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create') // thực thi
  async createPayment(
    @Req() req: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return await this.paymentService.createPayment(req, createPaymentDto);
  }

  @Get('/vnpay-return')
  async vnpayReturn(@Query() query: any) {
    return this.paymentService.vnpayReturn(query);
  }
}
// lấy dlieu
