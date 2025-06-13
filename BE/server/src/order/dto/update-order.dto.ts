import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../entities/order.entity';

export class UpdateOrderDetailDto {
  @IsString()
  id: string;

  @IsNotEmpty({ message: 'Sản phẩm không được để trống' })
  productId: string;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;

  @IsNotEmpty({ message: 'Đơn giá phải là số' })
  @IsNumber({}, { message: 'Đơn giá phải là số' })
  price: number;
}

export class UpdateOrderUserDto {
  @IsOptional()
  @IsString({ message: 'Địa chỉ giao hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  shippingAddress?: string;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ' })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString({ message: 'Ghi chú không hợp lệ' })
  notes?: string;

  @IsOptional()
  OrderDetails?: UpdateOrderDetailDto;
}

export class UpdateOrderAdminDto {
  @IsOptional()
  @IsString({ message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  shippingPhone?: string;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Trạng thái thanh toán không hợp lệ' })
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status?: OrderStatus;
}
