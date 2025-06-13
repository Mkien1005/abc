import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Order } from '../order/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { OrderDetail } from '../order/entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, OrderDetail, Product])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
