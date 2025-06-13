import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailerConfigModule } from '../mail/mailer.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartService } from 'src/cart/services/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart]),
    MailerConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UserService, JwtService, CartService],
})
export class UsersModule {}
