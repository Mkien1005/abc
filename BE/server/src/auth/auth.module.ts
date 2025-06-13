import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerConfigModule } from 'src/mail/mailer.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartService } from 'src/cart/services/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRED_TIME') || '1h',
        },
      }),
    }),
    MailerConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, CartService],
  exports: [JwtModule],
})
export class AuthModule {}
