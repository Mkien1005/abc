import { Module } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartDetail } from './entities/cart-detail.entity';
import { CartDetailService } from './services/cart-detail.service';
import { Product } from 'src/products/entities/product.entity';
import { CartController } from './controllers/cart.controller';
import { CartDetailController } from './controllers/cart-detail.controller';
import { CartService } from './services/cart.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartDetail, User, Product]),
    AuthModule,
  ],
  controllers: [CartController, CartDetailController],
  providers: [CartService, CartDetailService],
})
export class CartModule {}
