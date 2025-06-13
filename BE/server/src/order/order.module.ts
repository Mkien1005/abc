import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { UserOrderController } from './controllers/user/order.controller';
import { AdminOrderController } from './controllers/admin/order.controller';
import { AuthModule } from 'src/auth/auth.module';
import { OrderDetail } from './entities/order-detail.entity';
import { MailerConfigModule } from 'src/mail/mailer.module';
import { Product } from 'src/products/entities/product.entity';
import { CartDetail } from 'src/cart/entities/cart-detail.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, User, Product, CartDetail]),
    AuthModule,
    MailerConfigModule,
    NotificationModule,
  ],
  controllers: [UserOrderController, AdminOrderController],
  providers: [OrderService],
})
export class OrderModule {}
