import {
  Controller,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { UpdateOrderAdminDto } from 'src/order/dto/update-order.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@UseGuards(RolesGuard)
@Roles('admin')
@Controller('admin/order')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderAdminDto,
  ) {
    return await this.orderService.updateOrderAdmin(id, updateOrderDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('query') query: string,
  ) {
    const currentPage = page ? Number(page) : 1;
    const currentLimit = limit ? Number(limit) : 10;
    const userId = null;
    return await this.orderService.getAllOrders(
      {
        page: currentPage,
        limit: currentLimit,
      },
      userId,
      query,
    );
  }
}
