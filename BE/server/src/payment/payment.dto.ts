import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  bankCode?: string;

  @IsString()
  orderInfo: string;

  @IsString()
  orderType: string;

  @IsString()
  @IsOptional()
  locale?: string;

  @IsString()
  ipAddress: string;
}
