import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderDetail } from 'src/order/entities/order-detail.entity';
import { CartDetail } from 'src/cart/entities/cart-detail.entity';
import { Brand } from 'src/products/entities/brand.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { InventoryImport } from 'src/inventory/import.entity';
import { Notification } from 'src/notification/entities/notification.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Cart,
    Product,
    Order,
    OrderDetail,
    Category,
    CartDetail,
    Brand,
    Supplier,
    InventoryImport,
    Notification,
  ],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
});
