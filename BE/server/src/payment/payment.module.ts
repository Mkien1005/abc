import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
