import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { UpdateOrderUserDto } from 'src/order/dto/update-order.dto';
import { OrderService } from 'src/order/order.service';
@UseGuards(RolesGuard)
@Roles('user')
@Controller('order')
export class UserOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.sub;
    return await this.orderService.createOrder(createOrderDto, userId);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderUserDto,
  ) {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }

  @Get('monthly-comparison')
  async getMonthlyComparison() {
    return await this.orderService.getOrderStatsCurrentAndPreviousMonth();
  }

  @Get('summary-success')
  async getSuccessfulOrdersSummary() {
    const summary = await this.orderService.getSuccessfulOrdersSummary();
    return {
      success: true,
      data: summary,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    console.log('userId :>> ', userId);
    return await this.orderService.getOrderById(id, userId);
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = req.user.sub;
    return await this.orderService.getAllOrders({ page, limit }, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return await this.orderService.deleteOrder(id, userId);
  }

  @Post('payment')
  async createPayment(
    @Body() body: { order_id: string; amount: number; url_return: string },
  ) {
    return this.orderService.createPaymentUrl(
      body.order_id,
      body.amount,
      body.url_return,
    );
  }
}
